import { Hypergrid } from "../Hypergrid/types";
import { FeatureBase } from "./FeatureBase";

export class Drag extends FeatureBase {

    private dragHint: HTMLCanvasElement

    constructor() {
        super();
        this.dragHint = document.createElement('canvas')
        this.dragHint.id = 'drop-hint'
        this.dragHint.style.pointerEvents = 'none'
        this.dragHint.style.position = 'absolute'
    }

    initializeOn(grid: Hypergrid) {
        this.next?.initializeOn(grid)
        grid.div.appendChild(this.dragHint)
    }

    handleDocumentDragStart(grid: any, event: any): void {
        if (this.next) {
            this.next.handleDocumentDragStart(grid, event);
        }
    }

    handleDocumentDragOver(grid: any, event: { detail: { primitiveEvent: DragEvent } }): void {
        if (!grid.properties.enableDropHint) {
            return
        }

        this.renderDragHint(grid, event)
        this.scrollOnEdge(grid, event)
        if (this.next) {
            this.next.handleDocumentDragOver(grid, event);
        }
    }

    handleDocumentDragEnd(grid: any, event: any): void {
        if (this.next) {
            this.next.handleDocumentDragEnd(grid, event);
        }
    }

    handleDrop(grid: any, event: any): void {
        this.dragHint.style.display = 'none'
        if (this.next) {
            this.next.handleDrop(grid, event);
        }
    }

    scrollOnEdge(grid, event) {
        var cell = grid.getGridCellFromMousePoint(event.detail.mouse)
        const halfCellHeight = cell.cellEvent.bounds.height / 2
        const isLowerBottom = event.detail.mouse.y > grid.canvas.height - halfCellHeight
        if (isLowerBottom) {
            grid.scrollBy(0, 1)
            return
        }

        const headerRow = grid.getHeaderRowCount()
        if (grid.renderer.visibleRows.length > headerRow) {
            const firstRow = grid.renderer.visibleRows[headerRow]
            const isUpperTop = event.detail.mouse.y < firstRow.top + firstRow.height / 2
            if (isUpperTop) {
                grid.scrollBy(0, -1)
            }
        }
    }

    renderDragHint(grid, event) {
        this.dragHint.style.display = 'block'
        this.dragHint.width = grid.canvas.width;
        this.dragHint.height = grid.canvas.height;

        var cell = grid.getGridCellFromMousePoint(event.detail.mouse)

        const upperHalf = cell.cellEvent.bounds.y + cell.cellEvent.bounds.height / 2 > event.detail.primitiveEvent.y
        const hint_y = upperHalf ? cell.cellEvent.bounds.y : cell.cellEvent.bounds.y + cell.cellEvent.bounds.height

        const col = grid.renderer.visibleColumnsByIndex[grid.renderer.visibleColumnsByIndex.length - 1]
        const hint_x = col.right

        const ctx = this.dragHint.getContext('2d');
        ctx.strokeStyle = "rgb(173,216,230)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, hint_y);
        ctx.lineTo(hint_x, hint_y);
        ctx.stroke();
        ctx.closePath();
    }

}
