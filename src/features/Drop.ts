import { Hypergrid } from "../Hypergrid/types";
import { FeatureBase } from "./FeatureBase";

export class Drop extends FeatureBase {

    private dropHint: HTMLCanvasElement

    constructor() {
        super();
        this.dropHint = document.createElement('canvas')
        this.dropHint.id = 'drop-hint'
        this.dropHint.style.pointerEvents = 'none'
        this.dropHint.style.position = 'relative'
    }

    initializeOn(grid: Hypergrid) {
        this.next?.initializeOn(grid)
        grid.div.appendChild(this.dropHint)
    }

    handleDrop(grid, event) {
        console.log("#### DropFeature handleDrop")

        if (this.next) {
            this.next.handleDrop(grid, event);
        }
    }

    handleDocumentDragOver(grid: any, event: any): void {
        console.log("#### DropFeature handleDocumentDragOver")
        this.renderDropHint(grid, event)

        if (this.next) {
            this.next.handleDocumentDragOver(grid, event);
        }
    }

    renderDropHint(grid, event) {
        this.dropHint.width = grid.canvas.width;
        this.dropHint.height = grid.canvas.height;

        var cell = grid.getGridCellFromMousePoint(event.detail.mouse)

        const upperHalf = cell.cellEvent.bounds.y + cell.cellEvent.bounds.height / 2 > event.detail.primitiveEvent.y
        const hint_y = upperHalf ? cell.cellEvent.bounds.y : cell.cellEvent.bounds.y + cell.cellEvent.bounds.height

        const col = grid.renderer.visibleColumnsByIndex[grid.renderer.visibleColumnsByIndex.length - 1]
        const hint_x = col.right

        const ctx = this.dropHint.getContext('2d');
        ctx.strokeStyle = "rgb(173,216,230)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, hint_y);
        ctx.lineTo(hint_x, hint_y);
        ctx.stroke();
        ctx.closePath();
    }

}
