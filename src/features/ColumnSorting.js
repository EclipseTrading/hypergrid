
var Feature = require('./Feature');

/**
 * @typedef {import("../Hypergrid")} Hypergrid
 * @typedef {any} ColumnSorting
 */

/**
 * @constructor
 * @extends Feature
 */
// @ts-ignore Need to refactor to use classes
var ColumnSorting = Feature.extend('ColumnSorting', {

    /**
     * @memberOf ColumnSorting.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleClick: function(grid, event) {
        sort.call(this, grid, event);
    },

    /**
     * @memberOf ColumnSorting.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleDoubleClick: function(grid, event) {
        sort.call(this, grid, event, true);
    },

    /**
     * @memberOf ColumnSorting.prototype
     * @this {ColumnSorting}
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleMouseMove: function(grid, event) {
        var columnProperties;
        if (
            event.isRowFixed &&
            event.isHeaderCell &&
            (columnProperties = grid.behavior.getColumnProperties(event.gridCell.x)) &&
            !columnProperties.unsortable
        ) {
            this.cursor = 'pointer';
        } else {
            this.cursor = null;
        }
        if (this.next) {
            this.next.handleMouseMove(grid, event);
        }
    }

});

function sort(grid, event, onDoubleClick) {
    var columnProperties;
    if (
        event.isHeaderCell &&
        !(event.mousePointInLeftClickRect || event.mousePointInRightClickRect) &&
        !(columnProperties = event.columnProperties).unsortable &&
        !(columnProperties.sortOnDoubleClick ^ onDoubleClick) // both same (true or falsy)?
    ) {
        grid.fireSyntheticColumnSortEvent(event.gridCell.x, event.primitiveEvent.detail.keys);
    }

    if (this.next) {
        this.next[onDoubleClick ? 'handleDoubleClick' : 'handleClick'](grid, event);
    }
}

module.exports = ColumnSorting;
