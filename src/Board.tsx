import React, { useState, useEffect, useContext } from 'react'
import { shuffle, fill, flatten, sortBy } from 'lodash'

import { Matrix, Card, Element, Board } from './types'
import { Phase } from './phases'
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

function findIndex(matrix: Matrix, card: Card): [number, number] {
    for (let i in matrix) {
        for (let j in matrix[i]) {
            if (matrix[i][j] === card) return [Number(i), Number(j)]
        }
    }
    throw new Error('card not found')
}

function isClose(matrix: Matrix, card: Card, alreadySelected: Card): boolean {
    const [i, j] = findIndex(matrix, card)
    const [selI, selJ] = findIndex(matrix, alreadySelected)
    return isCloseIdx(i, j, selI, selJ)
}

function isCloseIdx(i: number, j: number, selI: number, selJ: number): boolean {
    return (Math.abs(selI - i) <= 1 && Math.abs(selJ - j) <= 1)
}

function onOneLine(matrix: Matrix, card: Card, selected: Array<Card>): boolean {
    const [selI1, selJ1] = findIndex(matrix, selected[0])
    const [selI2, selJ2] = findIndex(matrix, selected[1])
    const [i, j] = findIndex(matrix, card)

    // x = const
    if (selI1 === selI2 && i !== selI1) {
        console.log('HUI x=const')
        return false
    }
    // y = const
    if (selJ1 === selJ2 && j !== selJ1) {
        console.log('HUI y=const')
        return false
    }
    // x + y = const
    if ((selI1 + selJ1 === selI2 + selJ2) && (i + j !== selI1 + selJ1)) {
        console.log('HUI x + y = const')
        return false
    }
    // x - y = const
    if ((selI1 - selJ1 === selI2 - selJ2) && (i - j !== selI1 - selJ1)) {
        console.log('HUI x - y = const')
        return false
    }

    const sortedCards = sortBy(selected.map(c => findIndex(matrix, c)), (indx) => {
        const [i, j] = indx
        return (selI1 === selI2) ? j : i
    })

    // close to one of edge cards on the line
    const lastIdx = sortedCards.length - 1
    if (!(isCloseIdx(i, j, sortedCards[0][0], sortedCards[0][1]) ||
        isCloseIdx(i, j, sortedCards[lastIdx][0], sortedCards[lastIdx][1]))) {
        console.log('HUI close to edge case',
                    lastIdx,
                    isCloseIdx(i, j, sortedCards[0][0], sortedCards[0][1]),
                    isCloseIdx(i, j, sortedCards[lastIdx][0], sortedCards[lastIdx][1])
                   )
        return false
    }
    // unselect only for edge cards
    if (selected.includes(card) && !(
        (i === sortedCards[0][0] && j === sortedCards[0][1]) ||
        (i === sortedCards[lastIdx][0] && j === sortedCards[lastIdx][1])
    )) {
        console.log('HUI unselect only for edge case',
                    lastIdx,
                    (i === sortedCards[0][0] && j === sortedCards[0][1]),
                    (i === sortedCards[lastIdx][0] && j === sortedCards[lastIdx][1])
                   )
        return false
    }

    console.log("HUI TRUE",
                sortedCards,
                lastIdx,
                isCloseIdx(i, j, sortedCards[0][0], sortedCards[0][1]),
                isCloseIdx(i, j, sortedCards[lastIdx][0], sortedCards[lastIdx][1]),
                (i === sortedCards[0][0] && j === sortedCards[0][1]),
                (i === sortedCards[lastIdx][0] && j === sortedCards[lastIdx][1])
               )

    return true
}

export function useBoard(phase: Phase): Board {
    const [matrix, setMatrix] = useState(buildMatrix())
    const [selected, setSelected] = useState([] as Array<Card>)

    const selectCardFor = (card: Card) => (s: Array<Card>) => {
        // null - EmptyPlace по факту?
        if (card === null) return s
        if (s.includes(card)) {
            return s.filter((c: Card) => c !== card)
        }

        return s.concat([card])
    }

    const select = (card: Card, i: number, j: number) => {
        if (!(phase === Phase.SelectionToHand || phase === Phase.SelectionToOpen)) return
        if (phase === Phase.SelectionToOpen) {
            if (selected.length === 1) {
                if (!isClose(matrix, card, selected[0])) return
            } else if (selected.length > 1) {
                if (!onOneLine(matrix, card, selected)) return
            }
        }
        setSelected(selectCardFor(card))
    }

    return {
        matrix,
        selected,

        dropSelection: () => {
            setSelected([])
        },
        ejectSelected: () => {
            const newMatrix = selected.reduce((m: Matrix, c: Card) => removeCard(m, c), matrix)
            setMatrix(newMatrix)
            setSelected([])
            // TODO: сейфово так делать? возвращать значение после как его изменил через setSome
            return selected
        },
        placeCard: (card, i, j) => {
            // TODO: сейфово так делать? менять не иммутабельно
            matrix[i][j] = card
            setMatrix(matrix)
        },
        select,
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
        const selected = board.selected.includes(card)
        const onClick = () => {
            if (card === null) return props.placeFromHand(i, j)
            board.select(card, i, j)
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
