import Registry from '../lib/Registry';
import Button from './Button';
import SimpleCell from './SimpleCell';
import PlusMinusButtonCell from './PlusMinusButtonCell';
import SliderCell from './SliderCell';
import SparkBar from './SparkBar';
import LastSelection from './LastSelection';
import SparkLine from './SparkLine';
import ErrorCell from './ErrorCell';
import Tag from './Tag';
import TreeCell from './TreeCell';
import TreeGroupCell from './TreeGroupCell';

let warnedBaseClass: boolean;

/**
 * @classdesc Registry of cell renderer singletons.
 * @constructor
 */
const CellRenderers = Registry.extend('CellRenderers', {
    BaseClass: require('./CellRenderer'), // abstract base class
    initialize: function() {
        // preregister the standard cell renderers
        this.add(Button);
        this.add(SimpleCell);
        this.add(PlusMinusButtonCell);
        this.add(SliderCell);
        this.add(SparkBar);
        this.add(LastSelection);
        this.add(SparkLine);
        this.add(ErrorCell);
        this.add(Tag);
        this.add(TreeCell);
        this.add(TreeGroupCell);
        this.add('emptycell', this.BaseClass); // remove this when deprecation below retired
    },
    // for better performance, instantiate at add time rather than render time.
    add: function(name: any, Constructor?: any) {
        if (arguments.length === 1) {
            Constructor = name;
            return Registry.prototype.add.call(this, new Constructor());
        } else {
            return Registry.prototype.add.call(this, name, new Constructor());
        }
    },
    get: function(name: any) {
        if (name.map) {
            return name.map(function(name: any) {
                return Registry.prototype.get.call(this, name);
            }, this);
        }
        const cellRenderer = Registry.prototype.get.call(this, name);
        if (cellRenderer === this.items.emptycell) {
            if (!warnedBaseClass) {
                console.warn('grid.cellRenderers.get("' + name + '").constructor has been deprecated as of v2.1.0 in favor of grid.cellRenderers.BaseClass property. (Will be removed in a future release.)');
                warnedBaseClass = true;
            }
            this.BaseClass.constructor = this.BaseClass;
        }
        return cellRenderer;
    }
});

export default new CellRenderers();
