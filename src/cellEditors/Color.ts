import { CellEditor } from "./CellEditor";


/**
 * @constructor
 * @extends CellEditor
 */
// @ts-ignore TODO use classes

export class Color extends CellEditor {
    /**
     *
     */
    constructor(grid: any, options: any) {
        super(grid, options);

    }

    protected initProps() {
        this.template = '<input type="color" lang="{{locale}}" style="{{style}}">'
    }
}
