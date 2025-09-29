
// `columnEnum` et al, have been deprecated as of 3.0.0 in favor of accessing column schema
// through .schema, .columns, and .allColumns, all of which now sport self-referential dictionaries.
// To finally remove, delete this file and all lines using `_columnEnum`



var warned = {};

function warnColumnEnumDeprecation(method, msg) {
    if (!warned[method]) {
        console.warn('.' + method + ' has been deprecated as of v3.0.0. (Will be removed in a future release.) ' + (msg || ''));
        warned[method] = true;
    }
}

exports.mixin = {
    /**
     * @type {any} // Handle TS bug, remove this issue after resolved {@link https://github.com/microsoft/TypeScript/issues/41672}
     */
    columnEnumSynchronize: function() {
        this._columnEnumKey = this._columnEnumKey || 'toAllCaps';

        var columnEnum = this._columnEnum || (this._columnEnum = {}),
            // @ts-ignore
            allColumns = this.allColumns;
        // Synonym/transformer logic removed
        // Legacy: just map column names to their index
        allColumns.forEach(function(col, idx) {
            columnEnum[col.name] = idx;
        });
    },

    get columnEnum() {
        if (!warned.columnEnum) {
            console.warn('.columnEnum[propName] has been deprecated as of v3.0.0 in favor of either .getColumns()[propName].index or .schema[propName].index. (Will be removed in a future release.)');
            warned.columnEnum = true;
        }
        return this._columnEnum;
    },

    get columnEnumKey() {
        warnColumnEnumDeprecation('columnEnumKey');
        return this._columnEnumKey === 'verbatim' ? 'passThrough' : this._columnEnumKey;
    },
    set columnEnumKey(transformer) {
        warnColumnEnumDeprecation('columnEnumKey');
        // Only allow string assignment for legacy compatibility
        if (typeof transformer === 'string') {
            this._columnEnumKey = transformer;
        } else {
            throw new this.HypergridError('Expected string for .columnEnumKey assignment but received ' + typeof transformer + '.');
        }
    }
};

exports.mixInShared = {
    get columnEnumDecorators() {
        warnColumnEnumDeprecation('columnEnumDecorators');
        return {};
    }
};
