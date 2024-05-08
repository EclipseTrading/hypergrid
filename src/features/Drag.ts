import { Hypergrid } from "../Hypergrid/types";
import { FeatureBase } from "./FeatureBase";

export class Drag extends FeatureBase {

    private dragHint: HTMLCanvasElement

    constructor() {
        super();
        this.dragHint = document.createElement('canvas')
        this.dragHint.id = 'drag-hint'
        this.dragHint.style.pointerEvents = 'none'
        this.dragHint.style.position = 'relative'
    }

    initializeOn(grid: Hypergrid) {
        this.next?.initializeOn(grid)
        grid.div.appendChild(this.dragHint)
    }

    handleDocumentDragStart(grid: any, event: any): void {
    }

    handleDocumentDragEnd(grid: any, event: any): void {
    }

    renderRowDragHint(grid, event) {
        //TODO
    }

}
