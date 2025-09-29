
import Base from '../Base';

const endings = [
    { plural: /ies$/, singular: 'y' },
    { plural: /s$/, singular: '' }
];

function singularOf(name: string): string {
    endings.find(ending => {
        if (ending.plural.test(name)) {
            name = name.replace(ending.plural, ending.singular);
            return true;
        }
    });
    return name;
}

function indefArtOf(name: string): string {
    return /^[aeiou]/.test(name) ? 'an' : 'a';
}

interface RegistryType {
    items: Record<string, any>;
    BaseClass?: any;
    /**
     * @summary Register an item and return it.
     * @desc Adds an item to the registry using the provided name (or the class name), converted to all lower case.
     * @param {string} [name] - Case-insensitive item key. If not given, fallsback to `item.prototype.$$CLASS_NAME` or `item.prototype.name` or `item.name`.
     * @param [item] - If unregistered or omitted, nothing is added and method returns `undefined`.
     *
     * > Note: `$$CLASS_NAME` is normally set by providing a string as the (optional) first parameter (`alias`) in your {@link https://www.npmjs.com/package/extend-me|extend} call.
     *
     * @returns Newly registered item or `undefined` if unregistered.
     *
     * @memberOf Registry#
     */
    add(name: string, item?: any): any;
    addSynonym(synonymName: string, existingName: string): any;
    make(name: string, prototype: any): void;
    get(name: string): any;
    friendlyName(): string;
}

const Registry = Base.extend('Registry', {
    initialize: function (this: RegistryType) {
        this.items = Object.create(null);
    },
    add: function (this: RegistryType, name: string, item?: any): any {
        if (arguments.length === 1) {
            item = name;
            name = undefined as any;
        }
        if (!item) {
            return;
        }
        name = name || (item.getClassName && item.getClassName()) || item.name;
        if (!name) {
            throw new (this as any).HypergridError('Cannot register ' + this.friendlyName() + ' without a name.');
        }
        this.items[name] = item;
        // update existing keys that differ only in case
        const lowerName = name.toLowerCase();
        Object.keys(this.items)
            .filter(key => key.toLowerCase() === lowerName)
            .forEach(key => { this.items[key] = item; });
        return item;
    },
    addSynonym: function (this: RegistryType, synonymName: string, existingName: string): any {
        return (this.items[synonymName] = this.items[existingName]);
    },
    make: function (this: RegistryType, name: string, prototype: any): void {
        const last = arguments.length - 1;
        arguments[last] = (this.BaseClass as any).extend(arguments[last]);
        this.add.apply(this, arguments as any);
    },
    get: function (this: RegistryType, name: string): any {
        if (!name) {
            return;
        }
        let result = this.items[name]; // for performance reasons, do not convert to lower case
        if (!result) {
            const lowerName = name.toLowerCase(); // name may differ in case only
            const foundName = Object.keys(this.items).find(key => lowerName === key.toLowerCase());
            result = this.items[foundName!];
            if (result) {
                // Register name as a synonym for the found name for faster access next
                // time without having to convert to lower case on every get.
                this.addSynonym(name, foundName!);
            } else {
                throw new (this as any).HypergridError('Expected "' + name + '" to be a case-insensitive match for a registered ' + this.friendlyName() + '.');
            }
        }
        return result;
    },
    friendlyName: function (this: RegistryType): string {
        let name: string;
        if (this.BaseClass) {
            name = this.BaseClass.getClassName();
            name = name && name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        } else {
            name = singularOf((this as any).getClassName()).toLowerCase();
        }
        name = name || 'item';
        return indefArtOf(name) + ' ' + name;
    }
});

export = Registry;
