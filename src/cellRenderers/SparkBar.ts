import CellRenderer from './CellRenderer';

/**
 * Renders a bar chart sparkline, hence the name.
 * @constructor
 * @extends CellRenderer
 */
export default class SparkBar extends CellRenderer {
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
            (gc as any).cache.fillStyle = config.isSelected ? 'blue' : config.backgroundColor;
            gc.fillRect(x, y, width, height);
        }
        (gc as any).cache.fillStyle = fgColor;
        for (let i = 0; i < val.length; i++) {
            const barheight = val[i] / 110 * height;
            gc.fillRect(x + 5, y + height - barheight, eWidth * 0.6666, barheight);
            x += eWidth;
        }
        gc.closePath();
        config.minWidth = count * 10;
    }
}
