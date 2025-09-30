import Base from '../Base';

export type DataCellCoords = any;
export type GridCellCoords = any;
export type DataRowObject = any;
export type BoundingRect = any;

export interface RenderConfig {
    allRowsSelected: boolean;
    bounds: BoundingRect;
    leftClickRect?: object;
    centerClickRect?: object;
    rightClickRect?: object;
    dataCell: DataCellCoords;
    dataRow: DataRowObject;
    formatValue: (value: any) => string;
    gridCell: GridCellCoords;
    halign: string;
    isCellHovered: boolean;
    isCellSelected: boolean;
    isColumnHovered: boolean;
    isColumnSelected: boolean;
    isDataColumn: boolean;
    isDataRow: boolean;
    isHeaderRow: boolean;
    isInCurrentSelectionRectangle: boolean;
    isRowHovered: boolean;
    isRowSelected: boolean;
    isSelected: boolean;
    isUserDataArea: boolean;
    minWidth: number;
    mouseDown: boolean;
    prefillColor?: any;
    snapshot?: object;
    value: any;
}

/**
 * @constructor
 * @desc Instances of `CellRenderer` are used to render the 2D graphics context within the bound of a cell.
 *
 * Extend this base class to implement your own cell renderer.
 *
 * @tutorial cell-renderer
 */
export class CellRenderer extends Base {
    static className = 'CellRenderer';

    /**
     * @desc An empty implementation of a cell renderer, see [the null object pattern](http://c2.com/cgi/wiki?NullObject).
     * @param {CanvasRenderingContext2D} gc
     * @param {CellRenderer["renderConfig"]} config
     * @returns {void} Preferred pixel width of content. The content may or may not be rendered at that width depending on whether or not `config.bounds` was respected and whether or not the grid renderer is using clipping. (Clipping is generally not used due to poor performance.)
     * @memberOf CellRenderer.prototype
     */
    paint(gc: CanvasRenderingContext2D, config: RenderConfig): void {}

    /**
     * @desc A simple implementation of rounding a cell.
     * @param {CanvasRenderingContext2D} gc
     * @param {number} x - the x grid coordinate of my origin
     * @param {number} y - the y grid coordinate of my origin
     * @param {number} width - the width I'm allowed to draw within
     * @param {number} height - the height I'm allowed to draw within
     * @param {number} radius
     * @param {number} fill
     * @param {number|boolean} stroke
     * @memberOf CellRenderer.prototype
     */
    roundRect(
        gc: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number = 5,
        fill: boolean = false,
        stroke: boolean | number = true
    ): void {
        if (!stroke) stroke = true;
        if (!radius) radius = 5;
        gc.beginPath();
        gc.moveTo(x + radius, y);
        gc.lineTo(x + width - radius, y);
        gc.quadraticCurveTo(x + width, y, x + width, y + radius);
        gc.lineTo(x + width, y + height - radius);
        gc.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        gc.lineTo(x + radius, y + height);
        gc.quadraticCurveTo(x, y + height, x, y + height - radius);
        gc.lineTo(x, y + radius);
        gc.quadraticCurveTo(x, y, x + radius, y);
        gc.closePath();
        if (stroke) gc.stroke();
        if (fill) gc.fill();
        gc.closePath();
    }
}

export default CellRenderer;


