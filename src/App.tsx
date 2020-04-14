import React, { useState, useEffect } from 'react'
import cs from 'classnames'

import { Matrix, Card, Element } from './types'
import CardView from './Card'
import BoardView, { useBoard } from './Board'
import { HandView, usePlayer } from './Player'

import styles from './styles.module.scss'

// Card: closed, selected for hand(but not open), open for player(3 cards), open for both(when
// showdown), selected for place, selected for showdown

// function renderSelected(selected: Array<Card>, onCardClick: (c: Card) => void) {
//     const els = selected.map((card) => {
//         return <CardView card={card} onClick={onCardClick} open={true} />
//     })
//     return <div className={styles.selected}> { els } </div>
// }

// function cardOnClick (setMatrix: (m: any) => void, setSelected: (s: any) => void) {
//     return function (card: Card) {
//         setSelected((s: Array<Card>) => s.concat([card]))
//         setMatrix((m: Matrix) => removeCard(m, card))
//     }
// }

function selectedOnClick (setMatrix: (m: any) => void, setSelected: (s: any) => void) {
    return function (card: Card) {
    }
}

function App() {
    const board = useBoard()
    const player = usePlayer()

    const moveToHand = () => {
        const cards = board.moveToHand()
        player.hand.setCards(cards)
    }

    const placeFromHand = (i: number, j: number) => {
        const card = player.hand.placeCard()

        if (card !== null) {
            board.placeCard(card, i, j)
        }
    }

    return (
        <div className={styles.app}>
            <BoardView board={board} placeFromHand={placeFromHand} />
            <div onClick={moveToHand}> Move to hand </div>
            <HandView player={player} />
        </div>
    )
}

export default App
