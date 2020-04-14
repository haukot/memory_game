export enum Element {
    Air = "air",
    Water = "water",
    Fire = "fire",
    Earth = "earth"
}

// id only for React.key
// TODO: remove ' | null' - that because renderCard(Card | null) function in BoardView
export type Card = { id: number, element: Element } | null
export type Matrix = Array<Array<Card | null>>

export type Board = {
    matrix: Matrix,
    selectedForHand: Array<Card>,
    selectedForOpen: Array<Card>,

    placeCard: (c: Card, i: number, j: number) => void,
    moveToHand: () => Array<Card>,
    selectForHand: (c: Card) => void,
    selectForOpen: (c: Card) => void
}

export type PlayerHand = {
    cards: Array<Card>,
    selectedForPlace: Card | null,

    placeCard: () => Card,
    setCards: (c: Array<Card>) => void,
    selectForPlace: (c: Card) => void
}
export type Player = {
    name: string,
    hand: PlayerHand
}
