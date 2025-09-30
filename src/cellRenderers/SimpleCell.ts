import CellRenderer from './CellRenderer';
import { Rectangle } from 'rectangular';
const images = require('../../images');

// Type for our custom context with cache
type CachedContext = CanvasRenderingContext2D & { cache: any };
const { alpha } = require('../lib/graphics');


const WHITESPACE = /\s+/g;

function findLines(gc: any, config: any, words: string[], width: number): string[] {
    const lines: string[] = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
        const testLine = line + (line ? ' ' : '') + words[i];
        const metrics = gc.getTextWidth(testLine);
        if (metrics.width > width && line) {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }
    }
    if (line) lines.push(line);
    return lines;
}

function renderSingleLineText(gc: any, config: any, val: any, leftPadding: number, rightPadding: number, hideRightIcon: boolean): [number, number] {
    let x = config.bounds.x;
    let y = config.bounds.y;
    const width = config.bounds.width;
    let halignOffset = leftPadding;
    const halign = config.halign;
    let minWidth = 0;
    let metrics;
    const rightAligned = halign === 'right';
    const availWidth = width - leftPadding;
    let truncated = false;
    const cache = (gc as any).cache;
    if (config.columnAutosizing) {
        metrics = gc.getTextWidthTruncated(val, availWidth, config.truncateTextWithEllipsis, false, rightAligned);
        minWidth = metrics.width;
        val = metrics.string || val;
    } else {
        metrics = gc.getTextWidthTruncated(val, availWidth, config.truncateTextWithEllipsis, true, rightAligned);
        truncated = metrics.string !== undefined;
        if (truncated) {
            val = metrics.string;
        }
    }
    const rightEmptyWidth = availWidth - metrics.width;
    switch (halign) {
        case 'left':
            halignOffset = leftPadding;
            break;
        case 'right':
            halignOffset = !hideRightIcon || rightEmptyWidth > rightPadding ? Math.max(width - rightEmptyWidth, width - rightPadding) : width - config.cellPadding;
            break;
        case 'center':
            halignOffset = Math.max(leftPadding, (width - metrics.width) / 2);
            break;
        default:
            halignOffset = leftPadding;
            break;
    }
    if (val !== null) {
        x += halignOffset;
        y += Math.floor(config.bounds.height / 2);
        if (config.topPadding) {
            y += config.topPadding;
        }
        if (config.isUserDataArea) {
            if (config.link) {
                if (config.isCellHovered || !config.linkOnHover) {
                    if (config.linkColor) {
                        cache.strokeStyle = config.linkColor;
                    }
                    gc.beginPath();
                    underline(config, gc, val, x, y, 1);
                    gc.stroke();
                    gc.closePath();
                }
                if (config.linkColor && (config.isCellHovered || !config.linkColorOnHover)) {
                    cache.fillStyle = config.linkColor;
                }
            }
            if (config.strikeThrough === true) {
                gc.beginPath();
                strikeThrough(config, gc, val, x, y, 1);
                gc.stroke();
                gc.closePath();
            }
        }
        cache.textAlign = rightAligned ? 'right' : 'left';
        cache.textBaseline = 'middle';
        gc.simpleText(val, x, y);
    }
    return [minWidth, rightEmptyWidth];
}

function renderMultiLineText(gc: any, config: any, val: any, leftPadding: number, rightPadding: number): [number, number] {
    const x = config.bounds.x;
    const y = config.bounds.y;
    const width = config.bounds.width;
    const height = config.bounds.height;
    const cleanVal = (val + '').trim().replace(WHITESPACE, ' ');
    const lines = findLines(gc, config, cleanVal.split(' '), width);
    if (lines.length === 1) {
        return renderSingleLineText(gc, config, cleanVal, leftPadding, rightPadding, false);
    }
    let halignOffset = leftPadding;
    let valignOffset = config.voffset;
    const halign = config.halign;
    const textHeight = gc.getTextHeight(config.font).height;
    const cache = (gc as any).cache;
    switch (halign) {
        case 'right':
            halignOffset = width - rightPadding;
            break;
        case 'center':
            halignOffset = width / 2;
            break;
    }
    const hMin = 0, vMin = Math.ceil(textHeight / 2);
    valignOffset += Math.ceil((height - (lines.length - 1) * textHeight) / 2);
    halignOffset = Math.max(hMin, halignOffset);
    valignOffset = Math.max(vMin, valignOffset);
    cache.save();
    gc.beginPath();
    gc.rect(x, y, width, height);
    gc.clip();
    cache.textAlign = halign;
    cache.textBaseline = 'middle';
    for (let i = 0; i < lines.length; i++) {
        gc.simpleText(lines[i], x + halignOffset, y + valignOffset + (i * textHeight));
    }
    cache.restore();
    return [width, width];
}

function underline(config: any, gc: any, val: string, x: number, y: number, thickness: number) {
    const textWidth = gc.getTextWidth(val).width;
    let underlineX = x;
    let underlineY = Math.ceil(y) + Math.round(gc.getTextHeight(config.font).height / 2) - 0.5;
    (gc as any).cache.lineWidth = thickness;
    gc.moveTo(underlineX, underlineY);
    gc.lineTo(underlineX + textWidth, underlineY);
}

function strikeThrough(config: any, gc: any, val: string, x: number, y: number, thickness: number) {
    const textWidth = gc.getTextWidth(val).width;
    let strikeX = x;
    let strikeY = Math.ceil(y) - Math.round(gc.getTextHeight(config.font).height / 6) - 0.5;
    (gc as any).cache.lineWidth = thickness;
    gc.moveTo(strikeX, strikeY);
    gc.lineTo(strikeX + textWidth, strikeY);
}

function layerColors(gc: any, colors: string[], x: number, y: number, width: number, height: number, foundationColor: boolean) {
    for (let i = 0; i < colors.length; i++) {
        if (foundationColor && !i) {
            gc.clearFill(x, y, width, height, colors[i]);
        } else {
            (gc as any).cache.fillStyle = colors[i];
            gc.fillRect(x, y, width, height);
        }
    }
}





/**
 * @constructor
 * @summary The default cell renderer for a vanilla cell.
 * @desc Great care has been taken in crafting this function as it needs to perform extremely fast.
 *
 * Use `gc.cache` instead which we have implemented to cache the graphics context properties. Reads on the graphics context (`gc`) properties are expensive but not quite as expensive as writes. On read of a `gc.cache` prop, the actual `gc` prop is read into the cache once and from then on only the cache is referenced for that property. On write, the actual prop is only written to when the new value differs from the cached value.
 *
 * Clipping bounds are not set here as this is also an expensive operation. Instead, we employ a number of strategies to truncate overflowing text and content.
 *
 * @extends CellRenderer
 */
export class SimpleCell extends CellRenderer {
    paint(gc: CanvasRenderingContext2D, config: any): void {
        const cache = (gc as CachedContext).cache;
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
        let leftPadding, rightPadding, thicknessPadding;
        let hover, hoverColor, selectColor, foundationColor, inheritsBackgroundColor;
        let c, colors;

        if (val && val.constructor === Array) {
            leftIcon = val[0];
            rightIcon = val[2];
            val = config.exec(val[1]);
            if (val && val.naturalWidth !== undefined) {
                centerIcon = val;
                val = null;
            }
        } else {
            leftIcon = images[config.leftIcon];
            centerIcon = images[config.centerIcon];
            rightIcon = images[config.rightIcon];
        }

        const renderValue = val || (config.renderFalsy && val == 0);

        if (renderValue) {
            val = config.formatValue(val, config);
            textFont = config.isSelected ? config.foregroundSelectionFont : config.font;
            textColor = cache.strokeStyle = config.isSelected ? config.foregroundSelectionColor : config.color;
        } else {
            val = '';
        }

        same = same && val === snapshot?.value && textFont === snapshot?.textFont && textColor === snapshot?.textColor && leftIcon === snapshot?.leftIcon && rightIcon === snapshot?.rightIcon;

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
        if (same && c === (snapshot?.colors?.length || 0)) {
            if (config.hotIcon !== undefined) {
                config.leftClickRect = snapshot?.leftClickRect;
                config.centerClickRect = snapshot?.centerClickRect;
                config.rightClickRect = snapshot?.rightClickRect;
            }
            return;
        }
        config.snapshot = {
            value: val,
            leftIcon: leftIcon,
            rightIcon: rightIcon,
            textColor: textColor,
            textFont: textFont,
            foundationColor: foundationColor,
            colors: colors
        };
        layerColors(gc, colors, x, y, width, height, foundationColor);
        thicknessPadding = config.cellBorderThickness ? config.cellBorderThickness / 2 : 0;
        leftPadding = (leftIcon ? iconPadding + leftIcon.width + iconPadding : config.cellPadding) + thicknessPadding;
        rightPadding = (rightIcon ? iconPadding + rightIcon.width + iconPadding : config.cellPadding) + thicknessPadding;
        if (renderValue) {
            cache.fillStyle = textColor;
            cache.font = textFont;
            [valWidth, rightEmptyWidth] = config.isHeaderRow && config.headerTextWrapping
                ? renderMultiLineText(gc, config, val, leftPadding, rightPadding)
                : renderSingleLineText(gc, config, val, leftPadding, rightPadding, true);
        }
        if (centerIcon) {
            iyoffset = Math.round((height - centerIcon.height) / 2);
            ixoffset = width - Math.round((width - centerIcon.width) / 2) - centerIcon.width;
            gc.drawImage(centerIcon, x + ixoffset, y + iyoffset, centerIcon.width, centerIcon.height);
            valWidth = iconPadding + centerIcon.width + iconPadding;
            if (config.hotIcon === 'center') {
                config.centerClickRect = new Rectangle(ixoffset, iyoffset, centerIcon.width, centerIcon.height);
                config.snapshot.centerClickRect = config.centerClickRect;
            }
        }
        if (leftIcon) {
            iyoffset = Math.round((height - leftIcon.height) / 2);
            gc.drawImage(leftIcon, x + iconPadding, y + iyoffset, leftIcon.width, leftIcon.height);
            if (config.hotIcon === 'left') {
                config.leftClickRect = new Rectangle(iconPadding, iyoffset, leftIcon.width, leftIcon.height);
                config.snapshot.leftClickRect = config.leftClickRect;
            }
        }
        if (rightIcon && rightEmptyWidth > rightPadding) {
            ixoffset = width - (rightIcon.width + iconPadding);
            const rightX = x + ixoffset;
            if (inheritsBackgroundColor) {
                foundationColor = true;
                colors.unshift(config.backgroundColor);
            }
            layerColors(gc, colors, rightX, y, rightPadding, height, foundationColor);
            iyoffset = Math.round((height - rightIcon.height) / 2);
            gc.drawImage(rightIcon, rightX, y + iyoffset, rightIcon.width, rightIcon.height);
            if (config.hotIcon === 'right') {
                config.rightClickRect = new Rectangle(ixoffset, iyoffset, rightIcon.width, rightIcon.height);
                config.snapshot.rightClickRect = config.rightClickRect;
            }
        }
        if (config.cellBorderThickness) {
            gc.beginPath();
            const tickness = config.cellBorderThickness;
            gc.rect(
                x + thicknessPadding,
                y + thicknessPadding,
                width - tickness,
                height - tickness);
            cache.lineWidth = tickness;
            cache.strokeStyle = config.cellBorderStyle;
            gc.stroke();
            gc.closePath();
        }
        config.minWidth = leftPadding + valWidth + rightPadding;
    }
}


export default SimpleCell;
export { renderMultiLineText, renderSingleLineText, layerColors };
