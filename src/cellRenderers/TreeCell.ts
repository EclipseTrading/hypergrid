// Custom context type for extended canvas context
type CachedContext = CanvasRenderingContext2D & { cache: any; getTextWidth: (text: string) => number };

import CellRenderer from './CellRenderer';

/**
 * Renders a tree cell (presumably in the tree column).
 * @constructor
 * @extends CellRenderer
 */
export default class TreeCell extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const ctx = gc as CachedContext;
        const x = config.bounds.x;
        const y = config.bounds.y;
        const val = config.value.data;
        const indent = config.value.indent;
        const icon = config.value.icon;

        // Fill background only if our bgColor is populated or we are a selected cell.
        if (config.backgroundColor || config.isSelected) {
            ctx.cache.fillStyle = config.isSelected ? config.backgroundColor : config.backgroundColor;
            ctx.fillRect(x, y, config.bounds.width, config.bounds.height);
        }

        if (!val || !val.length) {
            return;
        }

        ctx.cache.fillStyle = config.isSelected ? config.backgroundColor : config.backgroundColor;

        const valignOffset = Math.ceil(config.bounds.height / 2);
        ctx.fillText(icon + val, x + indent, y + valignOffset);

        config.minWidth = x + indent + ctx.getTextWidth(icon + val) + 10;
    }
}
