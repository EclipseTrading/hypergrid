import CellRenderer from './CellRenderer';

/**
 * @constructor
 * @extends CellRenderer
 */
export default class Tag extends CellRenderer {
    /**
     * @memberOf Tag.prototype
     */
    paint(gc: CanvasRenderingContext2D, config: any): void {
        if (config.tagbands) {
            const tagband = config.tagbands.find((tagband: any) => config.value >= tagband.floor);
            const fillStyle = tagband && tagband.fillStyle;
            if (fillStyle) {
                const b = config.bounds;
                const x = b.x + b.width - 1;
                const y = b.y;
                gc.beginPath();
                gc.moveTo(x, y);
                gc.lineTo(x, y + 8);
                gc.lineTo(x - 8, y);
                gc.closePath();
                (gc as any).cache.fillStyle = fillStyle;
                gc.fill();
            }
        }
    }
}
