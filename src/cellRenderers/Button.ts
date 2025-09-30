import CellRenderer from './CellRenderer';

/**
 * The default cell rendering function for a button cell.
 * @constructor
 * @extends CellRenderer
 */
export default class Button extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const val = config.value;
        const bounds = config.bounds;
        let x = bounds.x + 1;
        let y = bounds.y + 1;
        let width = bounds.width - 2;
        let height = bounds.height - 2;
        const radius = height / 2;
        const arcGradient = gc.createLinearGradient(x, y, x, y + height);

        if (config.boxSizing === 'border-box') {
            width -= config.gridLinesVWidth;
            height -= config.gridLinesHWidth;
        }

        if (config.mouseDown) {
            arcGradient.addColorStop(0, '#B5CBED');
            arcGradient.addColorStop(1, '#4d74ea');
        } else {
            arcGradient.addColorStop(0, '#ffffff');
            arcGradient.addColorStop(1, '#aaaaaa');
        }

        // draw the background
        (gc as any).cache.fillStyle = config.backgroundColor;
        gc.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // draw the capsule
        (gc as any).cache.fillStyle = arcGradient;
        (gc as any).cache.strokeStyle = '#000000';
        this.roundRect(gc, x, y, width, height, radius, true, true);

        const ox = (width - (gc as any).getTextWidth(val)) / 2;
        const oy = (height - (gc as any).getTextHeight((gc as any).cache.font).descent) / 2;

        // draw the text
        (gc as any).cache.textBaseline = 'middle';
        (gc as any).cache.fillStyle = '#333333';
        (gc as any).cache.font = height - 2 + 'px sans-serif';
        config.backgroundColor = 'rgba(0,0,0,0)';
        gc.fillText(val, x + ox, y + oy);
    }
}
