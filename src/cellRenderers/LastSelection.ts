
const { alpha } = require('../lib/graphics');
import CellRenderer from './CellRenderer';

/**
 * @constructor
 * @desc A rendering of the last Selection Model
 * @extends CellRenderer
 */
export class LastSelection extends CellRenderer {
    /**
     * Paints the last selection overlay/outline.
     * @param gc CanvasRenderingContext2D
     * @param config RenderConfig
     */
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const cache = (gc as any).cache;
    const visOverlay = alpha(config.selectionRegionOverlayColor) > 0;
    const visOutline = alpha(config.selectionRegionOutlineColor) > 0;

        if (visOverlay || visOutline) {
            const x = config.bounds.x;
            const y = config.bounds.y;
            const width = config.bounds.width;
            const height = config.bounds.height;

            gc.beginPath();
            gc.rect(x, y, width, height);

            if (visOverlay) {
                cache.fillStyle = config.selectionRegionOverlayColor;
                gc.fill();
            }

            if (visOutline) {
                cache.lineWidth = 1;
                cache.strokeStyle = config.selectionRegionOutlineColor;
                gc.stroke();
            }

            gc.closePath();
        }
    }
}

export default LastSelection;
