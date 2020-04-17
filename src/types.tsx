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
    selected: Array<Card>,

    placeCard: (c: Card, i: number, j: number) => void,
    dropSelection: () => void,
    ejectSelected: () => Array<Card>,
    select: (c: Card, i: number, j: number) => void,
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
    hand: PlayerHand,
    score: {
        count: number,
        // TODO: should be combinations, not plain cards
        combinations: Array<Array<Card>>,

        updateScore: (cards: Array<Card>, count: number) => void
    }
}
