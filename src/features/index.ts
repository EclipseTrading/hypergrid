
import { CellEditing } from "./CellEditing";
import { ColumnMoving } from "./ColumnMoving";
import { ColumnResizing } from "./ColumnResizing";
import { Drag } from "./Drag";
import { OnHover } from "./OnHover";
var Registry = require('../lib/Registry');

/**
 * @classdesc Registry of feature constructors.
 * @param {boolean} [privateRegistry=false] - This instance will use a private registry.
 * @constructor
 */
var Features = Registry.extend('Features', {
    BaseClass: require('./Feature'), // abstract base class
    initialize: function () {
        this.add("CellClick", Features.CellClick);
        this.add("CellEditing", CellEditing);
        this.add("CellSelection", Features.CellSelection);
        this.add("ColumnMoving", ColumnMoving);
        this.add("ColumnResizing", ColumnResizing);
        this.add("ColumnSelection", Features.ColumnSelection);
        this.add("ColumnSorting", Features.ColumnSorting);
        this.add("Filters", Features.Filters);
        this.add("KeyPaging", Features.KeyPaging);
        this.add("OnHover", OnHover);
        this.add("Drag", Drag);
        this.add("RowSelection", Features.RowSelection);
        this.add("ThumbwheelScrolling", Features.ThumbwheelScrolling);
        this.add("TouchScrolling", Features.TouchScrolling);
    }
});

// Following shared props provided solely in support of build file usage, e.g., `fin.Hypergrid.features.yada`,
// presumably for overriding built-in features, and are not meant to be used elsewhere.

Features.BaseClass = require('./Feature'); // abstract base class
Features.CellClick = require('./CellClick');
Features.CellEditing = require('./CellEditing');
Features.CellSelection = require('./CellSelection');
Features.ColumnSelection = require('./ColumnSelection');
Features.ColumnSorting = require('./ColumnSorting');
Features.Filters = require('./Filters');
Features.KeyPaging = require('./KeyPaging');
Features.RowSelection = require('./RowSelection');
Features.ThumbwheelScrolling = require('./ThumbwheelScrolling');
Features.TouchScrolling = require('./TouchScrolling');

module.exports = new Features;
