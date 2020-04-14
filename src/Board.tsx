import React, { useState, useEffect } from 'react'
import { shuffle, fill, flatten } from 'lodash'

import { Matrix, Card, Element, Board } from './types'
import CardView from './Card'

import styles from './styles.module.scss'

function buildMatrix(): Matrix {
    // TODO: some way to iterate by enum?
    const elements = shuffle(flatten([
        Element.Air,
        Element.Water,
        Element.Fire,
        Element.Earth
    ].map(elem => fill(Array(9), elem))))

    const buildRow = (elements: Array<Element>, rowIndex: number) => {
        return elements
            .slice(rowIndex * 6, (rowIndex * 6) + 6)
            .map((element, i) => ({ id: (rowIndex * 10 + i), element }))
    }

    return [
        buildRow(elements, 0),
        buildRow(elements, 1),
        buildRow(elements, 2),
        buildRow(elements, 3),
        buildRow(elements, 4),
        buildRow(elements, 5)
    ]
}

function removeCard(matrix: Matrix, card: Card): Matrix {
    return matrix.map((row) => {
        return row.map((c) => c === card ? null : c)
    })
}

export function useBoard(): Board {
    const [matrix, setMatrix] = useState(buildMatrix())
    const [selectedForHand, setSelectedForHand] = useState([] as Array<Card>)
    const [selectedForOpen, setSelectedForOpen] = useState([] as Array<Card>)

    const selectCardFor = (card: Card) => (s: Array<Card>) => {
        // null - EmptyPlace по факту?
        if (card === null) return s
        if (s.includes(card)) {
            return s.filter((c: Card) => c !== card)
        }

        return s.concat([card])
    }

    const selectForHand = (card: Card) => {
        setSelectedForHand(selectCardFor(card))
    }

    const selectForOpen = (card: Card) => {
        setSelectedForHand(selectCardFor(card))
    }

    return {
        matrix,
        selectedForHand,
        selectedForOpen,

        moveToHand: () => {
            const newMatrix = selectedForHand.reduce((m: Matrix, c: Card) => removeCard(m, c), matrix)
            setMatrix(newMatrix)
            setSelectedForHand([])
            // TODO: сейфово так делать? возвращать значение после как его изменил через setSome
            return selectedForHand
        },
        placeCard: (card, i, j) => {
            // TODO: сейфово так делать? менять не иммутабельно
            matrix[i][j] = card
            setMatrix(matrix)
        },
        selectForHand,
        selectForOpen
    }
}

type BoardProps = {
    board: Board,
    placeFromHand: (i: number, j: number) => void
}

// matrix: Matrix, cardOnClick: (card: Card) => void
export default function BoardView(props: BoardProps) {
    const { board } = props

    const renderCard = (card: Card, i: number, j: number) => {
        const selected = board.selectedForHand.includes(card)
        const onClick = () => {
            if (card === null) return props.placeFromHand(i, j)
            board.selectForHand(card)
        }
        // TODO: Wtf key for null?
        return (
            <CardView
              key={card ? card.id : `null${i}${j}`}
              card={card}
              onClick={onClick}
              selected={selected}
           />
        )
    }

    return (
        <div>
            {
                board.matrix.map((row, i) => {
                    return <div className={styles.row}>
                        { row.map((card, j) => renderCard(card, i, j)) }
                    </div>
                })
            }
        </div>
    )
}
