import CellRenderer from './CellRenderer';
import { SimpleCell } from './SimpleCell.js';

/**
 * Renders a tree group cell.
 * @constructor
 * @extends CellRenderer
 */
const drillDown = '\u25bc';
const drillRight = '\u25b6';
const space = '    ';
const error = 'value is not valid treeInfo';

function createDisplayValue(treeGroup: any): string {
    if (typeof treeGroup.level !== 'number' || !treeGroup.groupName) {
        return error;
    }

    if (treeGroup.isLeaf) {
        return whitespace(treeGroup.level + 1) + ' ' + treeGroup.groupName;
    } else if (treeGroup.isExpanded) {
        return whitespace(treeGroup.level) + ' ' + drillDown + ' ' + treeGroup.groupName;
    } else {
        return whitespace(treeGroup.level) + ' ' + drillRight + ' ' + treeGroup.groupName;
    }
}

function whitespace(count: number): string {
    return space.repeat(count - 1);
}

export class TreeGroupCell extends CellRenderer {
    /**
     * Paints the tree group cell.
     * @param gc
     * @param config
     */
    paint(gc: CanvasRenderingContext2D, config: any): void {
        config.value = createDisplayValue(config.value);
        config.halign = 'left';
        // Call the base SimpleCell paint
        (SimpleCell.prototype.paint as Function).call(this, gc, config);
    }
}

export default TreeGroupCell;
