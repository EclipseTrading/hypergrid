import type { FinBar } from '../finbars/finbars';
import { HypergridCanvas } from '../lib/Canvas';

export type Hypergrid = {
    behavior: Behavior;
    div: HTMLElement;
    canvas: HypergridCanvas;
    hoverCell: any;
    renderer: Renderer;
    repaint: () => void;

    getRenderedWidth(colIndex: number): number;
    getRenderedHeight(rowIndex: number): number;

    sbVScroller: FinBar;
    sbHScroller: FinBar;

    getBounds(): Rectangle;

    /** The dimensions of the grid data have changed. You've been notified. */
    behaviorShapeChanged(): void;
}
