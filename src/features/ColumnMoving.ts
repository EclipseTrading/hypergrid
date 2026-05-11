import Column from "../behaviors/Column";
import { FeatureBase } from "./FeatureBase";

type VisibleColumn = {
    index?: number,
    columnIndex: number,
    left?: number,
    right?: number,
    width?: number,
    isOnScreen: boolean,
    column: Column
}

enum MoveLocation { Before, After }
enum DragActionType { Move, Delete, None }

type DeleteAction = {
    type: DragActionType.Delete
    source: VisibleColumn
}

type MoveAction = {
    type: DragActionType.Move
    location: MoveLocation
    source: VisibleColumn | null
    target: VisibleColumn | null
}

type NoAction = {
    type: DragActionType.None
}

type ColumnDragAction
    = MoveAction
    | DeleteAction
    | NoAction

export class ColumnMoving extends FeatureBase {

    static GRABBING = ['grabbing', '-moz-grabbing', '-webkit-grabbing']
    static GRAB = ['grab', '-moz-grab', '-webkit-grab']

    private dragOverlay: HTMLCanvasElement = null
    private dragCol: VisibleColumn = null
    private dragArmed: boolean = false
    private dragging: boolean = false
    private scrolling: boolean = false
    private scrollVelocity: number = 0

    initializeOn(grid: any) {
        this.dragOverlay = document.createElement('canvas')
        this.dragOverlay.id = "drag-overlay-highlight"
        this.dragOverlay.style.position = 'relative'
        this.dragOverlay.style.pointerEvents = 'none'
        this.dragOverlay.style.top = '0px'
        this.dragOverlay.style.left = '0px'
        this.dragOverlay.style.display = "none"

        grid.div.appendChild(this.dragOverlay)

        this.next?.initializeOn(grid)
    }

    handleMouseDown(grid, event) {
        const hasCTRL = event.keys.indexOf('CTRL') > -1
        if (
            grid.properties.columnsReorderable &&
            !event.primitiveEvent.detail.isRightClick &&
            !event.isColumnFixed &&
            event.isHeaderCell &&
            event.mousePoint.y < grid.properties.columnGrabMargin
        ) {
            this.dragOverlay.style.display = "block"
            this.dragArmed = true;
            this.cursor = ColumnMoving.GRABBING;
            // if user holding the key control, we dont want to clear the selection
            if (!hasCTRL) {
                grid.clearSelections();
            }
        }
        this.next?.handleMouseDown(grid, event)
    }

    handleMouseUp(grid, event) {
        if (this.dragging) {

            const dragAction = this.getDragAction(grid, event);

            this.endGridScrolling();
            this.endDragColumn(grid, dragAction);
            this.cursor = null
            // End Column Drag
            setTimeout(() => {
                this.attachChain();
                // This is fired so the hover feature
                //  can update the hovered column
                this.next.handleMouseMove(grid, event);
            }, 50);
        }
        this.dragOverlay.style.display = "none"
        this.dragging = false
        this.dragArmed = false
        requestAnimationFrame(() => this.render(grid, null))
        this.next?.handleMouseUp(grid, event)
    }

    handleMouseMove(grid, event: CellEvent) {
        if (
            grid.properties.columnsReorderable &&
            !event.isColumnFixed &&
            !this.dragging &&
            event.isHeaderCell &&
            event.mousePoint.y < grid.properties.columnGrabMargin - 2
        ) {
            this.cursor = ColumnMoving.GRAB;
        } else {
            this.cursor = null;
        }

        if (this.dragging) {
            this.cursor = ColumnMoving.GRABBING;
        }
        else {
            this.next?.handleMouseMove(grid, event);
        }
    }

    handleMouseDrag(grid, event: CellEvent) {
        if (event.isColumnFixed) {
            this.next?.handleMouseDrag(grid, event)
            return
        }

        if (event.isHeaderCell && this.dragArmed && !this.dragging) {
            this.dragCol = event.visibleColumn
            this.dragging = true
            this.detachChain()
        }
        else {
            this.next?.handleMouseDrag(grid, event)
        }

        if (this.dragging) {

            const dragAction = this.getDragAction(grid, event)

            if (dragAction.type === DragActionType.Delete) {
                this.scroll(grid, event.gridPoint, dragAction);
            }
            else {
                this.endGridScrolling();
            }

            requestAnimationFrame(() => this.render(grid, dragAction))
        }

    }

    private scroll(grid, targetPoint: Point, action: ColumnDragAction) {
        if (!this.scrolling) {
            this.scrolling = true
            this.beginGridScrolling(grid, action)
        }

        // When transposed, columns scroll vertically (use y instead of x)
        const transposed = grid.properties.transposed;
        const pos = transposed ? targetPoint.y : targetPoint.x;
        const size = transposed ? grid.getBounds().height : grid.getBounds().width;

        this.scrollVelocity = pos < 0
            ? -1
            : pos > size
                ? 1
                : 0
    }

    private endGridScrolling() {
        this.scrolling = false
        this.scrollVelocity = 0
    }

    private beginGridScrolling(grid, action: ColumnDragAction) {
        setTimeout(() => {
            if (!this.scrolling) {
                return
            }

            grid.scrollHBy(this.scrollVelocity)
            this.render(grid, action)

            this.beginGridScrolling(grid, action)
        },
        100)
    }

    private render(grid, dragAction: ColumnDragAction | null) {

        const dragContext = this.dragOverlay.getContext("2d", { alpha: true });
        this.dragOverlay.width = grid.canvas.width
        this.dragOverlay.height = grid.canvas.height
        dragContext.clearRect(0, 0, grid.canvas.width, grid.canvas.height)

        if (dragAction !== null) {
            const transposed = grid.properties.transposed;

            if (dragAction.type == DragActionType.Move) {
                const indicatorPos = dragAction.location === MoveLocation.Before
                    ? dragAction.target.left
                    : dragAction.target.right
                dragContext.fillStyle = "rgba(50, 50, 255, 1)"

                if (transposed) {
                    // When transposed, columns are horizontal bands - draw horizontal indicator
                    dragContext.fillRect(0, indicatorPos, grid.canvas.width, 2)
                } else {
                    // Normal mode - draw vertical indicator
                    dragContext.fillRect(indicatorPos, 0, 2, grid.canvas.height)
                }
            }

            const dragCol = grid.renderer.getVisibleColumn(this.dragCol.columnIndex)
            if (dragCol) {
                dragContext.fillStyle = dragAction.type == DragActionType.Delete
                    ? "rgba(255, 50, 50, 0.2)"
                    : "rgba(50, 50, 255, 0.2)"

                if (transposed) {
                    // When transposed, highlight the horizontal band
                    dragContext.fillRect(0, dragCol.left, grid.canvas.width, dragCol.width)
                } else {
                    // Normal mode - highlight the vertical column
                    dragContext.fillRect(dragCol.left, 0, dragCol.width, grid.canvas.height)
                }
            }
        }
    }

    private endDragColumn(grid, dragAction: ColumnDragAction) {
        switch (dragAction.type) {
            case DragActionType.Delete:
                grid.behavior.removeColumn(dragAction.source.columnIndex)
                grid.fireSyntheticColumnRemovedEvent(dragAction.source.columnIndex, dragAction.source.column)
                grid.clearSelections()
                break;
            case DragActionType.Move:
                if (dragAction.location === MoveLocation.Before) {
                    grid.behavior.moveColumnBefore(dragAction.source.columnIndex, dragAction.target.columnIndex)
                    grid.fireSyntheticColumnMovedBeforeEvent(
                        dragAction.source.columnIndex,
                        dragAction.source.column,
                        dragAction.target.columnIndex,
                        dragAction.target.columnIndex)
                } else {
                    grid.behavior.moveColumnAfter(dragAction.source.columnIndex, dragAction.target.columnIndex)
                    grid.fireSyntheticColumnMovedAfterEvent(
                        dragAction.source.columnIndex,
                        dragAction.source.column,
                        dragAction.target.columnIndex,
                        dragAction.target.columnIndex)
                }
                grid.clearSelections()
                break;
        }
        grid.fireSyntheticOnColumnsChangedEvent()
    }

    private getDragAction(grid, event) {
        const updatedDragCol = grid.renderer.getVisibleColumn(this.dragCol.columnIndex)
        const dragCol = updatedDragCol
            ? { ...updatedDragCol, isOnScreen: true }
            : { ...this.dragCol, isOnScreen: false };
        return ColumnMoving.getDragAction(
            dragCol,
            event.visibleColumn,
            grid.getBounds(),
            event.gridPoint,
            event.mousePoint,
            grid.properties.transposed
        )
    }

    private static getDragAction(
        dragCol: VisibleColumn,
        overCol: VisibleColumn,
        gridBounds: Rectangle,
        gridPoint: Point,
        mousePoint: Point,
        transposed?: boolean): ColumnDragAction {


        if (!gridBounds.contains(gridPoint)) {
            return {
                type: DragActionType.Delete,
                source: dragCol
            }
        }

        // When transposed, use y coordinate instead of x for position checks
        const gridPos = transposed ? gridPoint.y : gridPoint.x;
        const lower = dragCol.left - overCol.width / 2
        const upper = dragCol.right + overCol.width / 2
        const inMoveRange = !dragCol.isOnScreen || gridPos < lower || gridPos > upper
        if (!inMoveRange || overCol.index < 0) {
            return { type: DragActionType.None }
        }

        // mousePoint.x is already swapped for transposed mode, so it represents
        // position within the column dimension
        const location = mousePoint.x > overCol.width / 2
            ? MoveLocation.After
            : MoveLocation.Before

        return {
            type: DragActionType.Move,
            location,
            source: dragCol,
            target: overCol
        }
    }
}
