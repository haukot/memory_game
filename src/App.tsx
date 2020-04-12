import React, { useState, useEffect } from 'react'

import styles from './styles.scss'

function buildRow() {
    const water = 'water' as Element
    const fire = 'fire' as Element
    const air = 'air' as Element
    return [{ element: fire }, { element: water }, { element: air }]
}

function buildMatrix() {
    return [
        buildRow(),
        buildRow(),
        buildRow()
    ]
}

type Matrix = Array<Array<Card>>
// Maybe: enum Element { Air = "Air", } ?
type Element = 'water' | 'fire' | 'earth' | 'air'
type Card = { element: Element }

function renderCard(card: Card) {
    return <div>{ card.element }</div>
}

function renderMatrix(matrix: Matrix) {
    return matrix.map((row) => {
        return <div className={styles.row}> { row.map((elem) => renderCard(elem)) } </div>
    })
}

function App() {
    const [matrix, setMatrix] = useState(buildMatrix())

    return (
        <div className="App">
            { renderMatrix(matrix) }
        </div>
    )
}

export default App
