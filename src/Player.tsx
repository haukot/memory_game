import React, { useState, useEffect, useContext } from 'react'

import { Card, Player } from './types'
import CardView from './Card'
import { Phase } from './phases'

import styles from './styles.module.scss'

type PlayerProps = {
    player: Player
}

export function usePlayer(phase: Phase) {
    const [selectedForPlace, setSelectedForPlace] = useState(null as Card)
    const [handCards, setHandCards] = useState([] as Array<Card>)
    const [scoreCount, setScoreCount] = useState(0)
    const [scoreCombinations, setScoreCombinations] = useState([] as Array<Array<Card>>)

    const selectForPlace = (card: Card) => {
        if (phase !== Phase.SelectionToPlace) return
        setSelectedForPlace((s: Card) => {
            if (s === card) return null
            return card
        })
    }

    return {
        name: 'Player1',
        hand: {
            cards: handCards,
            selectedForPlace,

            setCards: (c: Array<Card>) => setHandCards(c),
            placeCard: () => {
                const card = selectedForPlace
                const newHandCards = handCards.filter(c => c !== card)
                setHandCards(newHandCards)
                setSelectedForPlace(null)

                return card
            },
            selectForPlace
        },
        score: {
            count: scoreCount,
            combinations: scoreCombinations,
            updateScore: (cards: Array<Card>, count: number) => {
                setScoreCombinations(c => c.concat([cards]))
                setScoreCount(c => c + count)
            }
        }
    }
}

export function HandView (props: PlayerProps) {
    const { player } = props

    const els = player.hand.cards.map((card, i) => {
        const selected = player.hand.selectedForPlace === card
        // TODO: Wtf key for null?
        return (
            <CardView
               key={card ? card.id : `null${i}`}
               card={card}
               onClick={() => player.hand.selectForPlace(card)}
               open={true}
               selected={selected}
           />
        )
    })
    return <div className={styles.hand}> { els } </div>
}


export function ScoreView(props: PlayerProps) {
    const { player } = props
    return <div className={styles.score}>
        Score: { player.score.count }
       { player.score.combinations.length > 0 && <div> Combinations: </div> }
       { player.score.combinations.map((combination) => {
          return <div className={styles.combination}>
            { combination.map((card) => {
                return <CardView
                  key={card ? card.id : `null`}
                  onClick={() => {}}
                  card={card}
                  open={true}
                />
              })
            }
           </div>
         })
        }
    </div>
}
