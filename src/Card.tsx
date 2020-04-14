import React from 'react'
import cs from 'classnames'

import { Card } from './types'

import styles from './styles.module.scss'

type CardProps = {
    card: Card | null,
    onClick: (card: Card) => void,
    open?: boolean,
    selected?: boolean
}

export default function CardView(props: CardProps) {
    const { card, onClick } = props
    const { open = false, selected = false } = props
    if (!card) {
        return <div className={styles.card} onClick={() => onClick(card)}></div>
    }
    const className = cs(styles.card, {
        [`-${card.element}`]: true, // open,
        [styles.cardClosed]: false, //!open,
        [styles.selected]: selected
    })

    return <div className={className} onClick={() => onClick(card)}>
        { card.element }
    </div>
}
