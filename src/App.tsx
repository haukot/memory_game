import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import { uniqBy } from 'lodash'

import { Matrix, Card, Element } from './types'
import CardView from './Card'
import BoardView, { useBoard } from './Board'
import { HandView, usePlayer } from './Player'
import { Phase, nextPhase } from './phases'

import styles from './styles.module.scss'

const checkScore = (cards: Array<Card>): number => {
    const unique = uniqBy(cards, 'element')
    const count = cards.length

    const allfourScore = 4
    const scores = {
        3: 3,
        4: 5,
        5: 7,
        6: 9
    }
    const haveScore = (count: number): count is keyof typeof scores => {
        return count in scores
    }
    if (unique.length === count && count !== 4) return 0
    if (unique.length === count && count === 4) return allfourScore
    if (unique.length !== 1) return 0
    if (!haveScore(count)) return 0

    return scores[count]
}

function App() {
    const [phase, setPhase] = useState(Phase.SelectionToOpen) // Hand)
    const board = useBoard(phase)
    const player = usePlayer(phase)

    const changePhase = () => {
        const next = nextPhase(phase)
        setPhase(next)
    }

    const moveToHand = () => {
        const cards = board.ejectSelected()
        player.hand.setCards(cards)
        changePhase()
    }

    const placeFromHand = (i: number, j: number) => {
        const card = player.hand.placeCard()

        if (card !== null) {
            board.placeCard(card, i, j)
            // 1 because at this moment placeCard not removed yet the last card
            if (player.hand.cards.length === 1) {
                changePhase()
            }
        }
    }

    const openCards = () => {
        const cards = board.selected
        const score = checkScore(cards)
        if (score > 0) {
            board.ejectSelected()
            player.score.updateScore(cards, score)
        } else {
            board.dropSelection()
        }
        changePhase()
    }

    return (
         <div className={styles.app}>
           <BoardView board={board} placeFromHand={placeFromHand} />
           { (board.selected.length > 0 && phase === Phase.SelectionToHand) &&
              <div onClick={moveToHand}> Move to hand </div>
           }
           { (board.selected.length > 0 && phase === Phase.SelectionToOpen) &&
              <div onClick={openCards}> Open cards </div>
           }
           <HandView player={player} />
           { player.score.count }
         </div>
    )
}

export default App
