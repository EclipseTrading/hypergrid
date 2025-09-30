import CellRenderer from './CellRenderer';

/**
 * Renders a sparkline.
 * {@link http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR|Edward Tufte sparkline}
 * @constructor
 * @extends CellRenderer
 */
export default class SparkLine extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        let x = config.bounds.x;
        const y = config.bounds.y;
        const width = config.bounds.width;
        const height = config.bounds.height;
        gc.beginPath();
        const val = config.value;
        if (!val || !val.length) {
            return;
        }
        const count = val.length;
        const eWidth = width / count;
        const fgColor = config.isSelected ? config.foregroundSelectionColor : config.color;
        if (config.backgroundColor || config.isSelected) {
            (gc as any).cache.fillStyle = config.isSelected ? config.backgroundSelectionColor : config.backgroundColor;
            gc.fillRect(x, y, width, height);
        }
        (gc as any).cache.strokeStyle = fgColor;
        (gc as any).cache.fillStyle = fgColor;
        gc.beginPath();
        let prev: number | undefined;
        for (let i = 0; i < val.length; i++) {
            const barheight = val[i] / 110 * height;
            if (prev === undefined) {
                prev = barheight;
            }
            gc.lineTo(x + 5, y + height - barheight);
            gc.arc(x + 5, y + height - barheight, 1, 0, 2 * Math.PI, false);
            x += eWidth;
        }
        config.minWidth = count * 10;
        gc.stroke();
        gc.closePath();
    }
}
