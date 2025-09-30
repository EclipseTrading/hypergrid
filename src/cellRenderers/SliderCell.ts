import CellRenderer from './CellRenderer';

/**
 * Renders a slider button.
 * Currently however the user cannot interact with it.
 * @constructor
 * @extends CellRenderer
 */
export default class SliderCell extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const x = config.bounds.x;
        const y = config.bounds.y;
        const width = config.bounds.width;
        const height = config.bounds.height;
        const cache = (gc as any).cache;
        cache.strokeStyle = 'white';
        const val = config.value;
        const radius = height / 2;
        const offset = width * val;
        const bgColor = config.isSelected ? config.backgroundColor : '#333333';
        const btnGradient = gc.createLinearGradient(x, y, x, y + height);
        btnGradient.addColorStop(0, bgColor);
        btnGradient.addColorStop(1, '#666666');
        const arcGradient = gc.createLinearGradient(x, y, x, y + height);
        arcGradient.addColorStop(0, '#aaaaaa');
        arcGradient.addColorStop(1, '#777777');
    cache.fillStyle = btnGradient;
    this.roundRect(gc, x, y, width, height, radius, true, true);
        if (val < 1.0) {
            cache.fillStyle = arcGradient;
        } else {
            cache.fillStyle = '#eeeeee';
        }
        gc.beginPath();
        gc.arc(x + Math.max(offset - radius, radius), y + radius, radius, 0, 2 * Math.PI);
        gc.fill();
        gc.closePath();
        config.minWidth = 100;
    }
}
