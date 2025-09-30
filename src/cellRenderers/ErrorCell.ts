import CellRenderer from './CellRenderer';

/**
 * @constructor
 * @extends CellRenderer
 */
export class ErrorCell extends CellRenderer {
    /**
     * Writes error message into cell.
     *
     * This function is guaranteed to be called as follows:
     *
     * ```javascript
     * gc.save();
     * gc.beginPath();
     * gc.rect(x, y, width, height);
     * gc.clip();
     * behavior.getCellProvider().renderCellError(gc, message, x, y, width, height);
     * gc.restore();
     * ```
     *
     * Before doing anything else, this function should clear the cell by setting `gc.fillStyle` and calling `gc.fill()`.
     *
     * @param gc CanvasRenderingContext2D
     * @param config RenderConfig
     */
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const x = config.bounds.x;
        const y = config.bounds.y;
        // const width = config.bounds.width;
        const height = config.bounds.height;
        const cache = (gc as any).cache;
        const message = config.value;

        // clear the cell
        // (this makes use of the rect path defined by the caller)
        cache.fillStyle = '#FFD500';
        gc.fill();

        // render message text
        cache.fillStyle = '#A00';
        cache.textAlign = 'start';
        cache.textBaseline = 'middle';
        cache.font = 'bold 6pt "arial narrow", verdana, geneva';
        gc.fillText(message, x + 4, y + height / 2 + 0.5);
    }
}

export default ErrorCell;
