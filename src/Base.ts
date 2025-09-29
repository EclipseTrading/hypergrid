import { Base as ExtendMeBase } from 'extend-me';
import deprecated from './lib/deprecated';
import HypergridError from './lib/error';
import { mixIn } from 'overrider';

/**
 * @constructor
 * @desc Extend from this base class using `Base.extend` per example.
 * @example
 * var prototype = { ... };
 * var descendantClass = Base.extend(prototype};
 * @classdesc This is an abstract base class available for all Hypergrid classes.
 */
class Base extends ExtendMeBase {
    static extend = ExtendMeBase.extend;
    deprecated = deprecated;
    HypergridError = HypergridError;

    notify(message: string, onerror?: 'warn' | 'alert'): void {
        switch (onerror) {
            case 'warn':
                console.warn(message);
                break;
            case 'alert':
                alert(message);
                break;
            default:
                throw new this.HypergridError(message);
        }
    }

    /**
     * Convenience function for getting the value when that value can be defined as a function that needs to be called to get the actual (primitive) value.
     * @param value
     * @returns {*}
     */
    unwrap<T>(value: T | (() => T)): T {
        if (typeof value === 'function') {
            return (value as () => T)();
        }
        return value;
    }

    /**
     * Mixes source members into calling context.
     * @param source
     */
    mixIn(source: object): void {
        mixIn.call(this, source);
    }

    /**
     * Instantiate an object with discrete + variable args.
     * @param Constructor
     * @param variableArgArray
     * @param discreteArgs
     * @returns {object}
     */
    createApply<T>(Constructor: new (...args: any[]) => T, variableArgArray: any[], ...discreteArgs: any[]): T {
        const args = [null, ...discreteArgs, ...variableArgArray];
        const BoundConstructor = Constructor.bind.apply(Constructor, args);
        return new BoundConstructor();
    }
}



// Assign legacy prototype properties for extension compatibility
Object.assign(Base.prototype, {
    HypergridError: HypergridError,
    deprecated: deprecated,
    unwrap: function<T>(value: T | (() => T)): T {
        if (typeof value === 'function') {
            return (value as () => T)();
        }
        return value;
    }
});

export default Base;
