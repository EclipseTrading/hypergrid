
import { CellEditing } from "./CellEditing";
import { ColumnMoving } from "./ColumnMoving"
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
        // preregister the standard cell renderers
        this.add(Features.CellClick);
        this.add(CellEditing);
        this.add(Features.CellSelection);
        this.add(ColumnMoving);
        this.add(ColumnResizing);
        this.add(Features.ColumnSelection);
        this.add(Features.ColumnSorting);
        this.add(Features.Filters);
        this.add(Features.KeyPaging);
        this.add(OnHover);
        this.add(Drag);
        this.add(Features.RowSelection);
        this.add(Features.ThumbwheelScrolling);
        this.add(Features.TouchScrolling);
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
