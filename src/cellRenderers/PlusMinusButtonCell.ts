import CellRenderer from './CellRenderer';
import { Rectangle } from 'rectangular';
const { renderMultiLineText, renderSingleLineText, layerColors } = require('./SimpleCell');
const { alpha } = require('../lib/graphics');

/**
 * @constructor
 * @summary This class is a copy of SimpleCell render with extra implementation on supporting two buttons on the same cell
 * @desc Great care has been taken in crafting this function as it needs to perform extremely fast.
 *
 * Use `gc.cache` instead which we have implemented to cache the graphics context properties. Reads on the graphics context (`gc`) properties are expensive but not quite as expensive as writes. On read of a `gc.cache` prop, the actual `gc` prop is read into the cache once and from then on only the cache is referenced for that property. On write, the actual prop is only written to when the new value differs from the cached value.
 *
 * Clipping bounds are not set here as this is also an expensive operation. Instead, we employ a number of strategies to truncate overflowing text and content.
 *
 * @extends CellRenderer
 */
export class PlusMinusButtonCell extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const cache = (gc as any).cache;
        let val = config.value;
        const bounds = config.bounds;
        const x = bounds.x;
        const y = bounds.y;
        const width = bounds.width;
        const height = bounds.height;
        const iconPadding = config.iconPadding;
        const partialRender = config.prefillColor === undefined;
        const snapshot = config.snapshot;
        let same = snapshot && partialRender;
        let valWidth = 0;
        let rightEmptyWidth = 0;
        let textColor, textFont;
        let ixoffset, iyoffset;
        let leftIcon, rightIcon, centerIcon;
        let leftIconId, rightIconId;
        let leftPadding, rightPadding;
        let hover, hoverColor, selectColor, foundationColor, inheritsBackgroundColor;
        let c, colors;

        if (val && val.constructor === Array) {
            leftIcon = val[0];
            rightIcon = val[2];
            leftIconId = leftIcon?.id;
            rightIconId = rightIcon?.id;
            val = config.exec(val[1]);
            if (val && val.naturalWidth !== undefined) {
                centerIcon = val;
                val = null;
            }
        }

        const renderValue = val || (config.renderFalsy && val == 0);

        if (renderValue) {
            val = config.formatValue(val, config);
            textFont = config.isSelected ? config.foregroundSelectionFont : config.font;
            textColor = cache.strokeStyle = config.isSelected ? config.foregroundSelectionColor : config.color;
        } else {
            val = '';
        }

        same = same && val === snapshot?.value && textFont === snapshot?.textFont && textColor === snapshot?.textColor;

        colors = [];
        c = 0;
        if (config.isCellHovered && config.hoverCellHighlight.enabled) {
            hoverColor = config.hoverCellHighlight.backgroundColor;
        } else if (config.isRowHovered && (hover = config.hoverRowHighlight).enabled) {
            hoverColor = config.isDataColumn || !hover.header || hover.header.backgroundColor === undefined ? hover.backgroundColor : hover.header.backgroundColor;
        } else if (config.isColumnHovered && (hover = config.hoverColumnHighlight).enabled) {
            hoverColor = config.isDataRow || !hover.header || hover.header.backgroundColor === undefined ? hover.backgroundColor : hover.header.backgroundColor;
        }
        if (alpha(hoverColor) < 1) {
            if (config.isSelected) {
                selectColor = config.backgroundSelectionColor;
            }
            if (alpha(selectColor) < 1) {
                inheritsBackgroundColor = (config.backgroundColor === config.prefillColor);
                if (!inheritsBackgroundColor) {
                    foundationColor = true;
                    colors.push(config.backgroundColor);
                    same = same && foundationColor === snapshot?.foundationColor && config.backgroundColor === snapshot?.colors[c++];
                }
            }
            if (selectColor !== undefined) {
                colors.push(selectColor);
                same = same && selectColor === snapshot?.colors[c++];
            }
        }
        if (hoverColor !== undefined) {
            colors.push(hoverColor);
            same = same && hoverColor === snapshot?.colors[c++];
        }
        same = same && leftIconId === snapshot?.leftIconId && rightIconId === snapshot?.rightIconId;
        if (same && c === (snapshot?.colors?.length || 0)) {
            config.leftClickRect = snapshot?.leftClickRect;
            config.rightClickRect = snapshot?.rightClickRect;
            return;
        }
        config.snapshot = {
            value: val,
            textColor: textColor,
            textFont: textFont,
            foundationColor: foundationColor,
            colors: colors,
            leftIconId: leftIconId,
            rightIconId: rightIconId
        };
        layerColors(gc, colors, x, y, width, height, foundationColor);
        leftPadding = leftIcon ? iconPadding + leftIcon.width + iconPadding : config.cellPadding;
        rightPadding = rightIcon ? iconPadding + rightIcon.width + iconPadding : config.cellPadding;
        if (renderValue) {
            cache.fillStyle = textColor;
            cache.font = textFont;
            [valWidth, rightEmptyWidth] = config.isHeaderRow && config.headerTextWrapping
                ? renderMultiLineText(gc, config, val, leftPadding, rightPadding)
                : renderSingleLineText(gc, config, val, leftPadding, rightPadding, false);
        }
        if (leftIcon) {
            iyoffset = Math.round((height - leftIcon.height) / 2);
            gc.drawImage(leftIcon, x + iconPadding, y + iyoffset, leftIcon.width, leftIcon.height);
            config.leftClickRect = new Rectangle(iconPadding, config.appendHeightToClickRect ? y + iyoffset : iyoffset, leftIcon.width, leftIcon.height);
            config.snapshot.leftClickRect = config.leftClickRect;
        }
        if (rightIcon) {
            ixoffset = width - (rightIcon.width + iconPadding);
            const rightX = x + ixoffset;
            if (inheritsBackgroundColor) {
                foundationColor = true;
                colors.unshift(config.backgroundColor);
            }
            layerColors(gc, colors, rightX, y, rightPadding, height, foundationColor);
            iyoffset = Math.round((height - rightIcon.height) / 2);
            gc.drawImage(rightIcon, rightX, y + iyoffset, rightIcon.width, rightIcon.height);
            config.rightClickRect = new Rectangle(ixoffset, config.appendHeightToClickRect ? y + iyoffset : iyoffset, rightIcon.width, rightIcon.height);
            config.snapshot.rightClickRect = config.rightClickRect;
        }
        if (config.cellBorderThickness) {
            gc.beginPath();
            gc.rect(x, y, width, height);
            cache.lineWidth = config.cellBorderThickness;
            cache.strokeStyle = config.cellBorderStyle;
            gc.stroke();
            gc.closePath();
        }
        config.minWidth = leftPadding + valWidth + rightPadding;
    }
}

export default PlusMinusButtonCell;
