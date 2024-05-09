export type Hypergrid = {
    behavior: Behavior;
    div: HTMLElement;
    canvas: HTMLCanvasElement;
    hoverCell: any;
    renderer: Renderer
    repaint: () => void;

    getRenderedWidth(colIndex: number): number;
    getRenderedHeight(rowIndex: number): number;
}

export type Renderer = {
    visibleColumns: any[];
    visibleRows: any[];
    visibleColumnsByIndex: any[];
    visibleRowsByDataRowIndex: any[];
}
