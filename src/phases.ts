export enum Phase {
    SelectionToHand = 'selectionToHand',
    SelectionToPlace = 'selectionToPlace',
    SelectionToOpen = 'selectionToOpen'
}

export function nextPhase(phase: Phase): Phase {
    switch(phase) {
        case Phase.SelectionToHand:
            return Phase.SelectionToPlace
        case Phase.SelectionToPlace:
            return Phase.SelectionToOpen
        case Phase.SelectionToOpen:
            return Phase.SelectionToHand
    }
}
