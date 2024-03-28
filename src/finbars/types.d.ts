import type {FinBar} from './finbars';

/**
 * Styles to be applied to scrollbar on resize.
 *
 * @remarks
 * Only enough of the above style properties need to be specified sufficient to place the scrollbar in its container. Specifically:
 *
 * - For horizontal scrollbars, some combination of `left` and either `width` or `right`.
 * - For vertical scrollbars, some combination of `top` and either `height` or `bottom`.
 *
 * Values for some or all of these may come from your stylesheets, in which case they may be omitted here.
 *
 * > Tip: Remember, CSS always measures values for `right` and `bottom` _backwards_ from their respective container edges. That is, positive values measure towards the left and top, respectively.
 *
 * In addition to the properties listed below, you can also use any of the {@link OrientationHashType} pseudo-properties.
 *
 * Regarding style values, the following to transformations are performed for your convenience:
 *
 * 1. If style value is a number with no CSS unit specified, "px" is appended.
 * 2. If style value is a percentage _and_ has margins, it is converted to pixel units, as a percentage of the scrollbar's parent element, minus its margins, with "px" appended. (CSS on its own does not consider margins part of the percentage.)
 */
export interface FinBarStyles {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
}

/**
 * In the following, two defaults are shown for each property, for the vertical and horizontal orientation hashes, respectively.
 *
 * The description for each refers to the property relevant to the scrollbar's orientation.
 */
export interface OrientationHashType {
    /** The name of the `MouseEvent` property that holds the relevant viewport coordinate. */
    coordinate: 'clientY'|'clientX';
    /** The name of the `MouseEvent` property that holds the relevant document coordinate. */
    axis: 'pageY'|'pageX';
    /** The name of the scrollbar's `style` object property that holds the extent (size) of the scrollbar. */
    size: 'height'|'width';
    /** The name of the scrollbar's `style` object property that refers to the edge of the scrollbar, typically anchored (by being set to 0) to that same edge inside the containing element. */
    outside: 'right'|'bottom';
    /** The name of the scrollbar's `style` object property that refers to the edge of the scrollbar that is not typically anchored to the containing element. */
    inside: 'left'|'top';
    /** The name of the scrollbar's `style` object property that refers to the low-order end (edge) of the scrollbar, typically anchored (by being set to 0) to that same edge inside the containing element. */
    leading: 'top'|'left';
    /** The name of the scrollbar's `style` object property that refers to the high-order end (edge) of the scrollbar, typically anchored (by being set to 0) to that same edge inside the containing element. */
    trailing: 'bottom'|'right';
    /** The name of the scrollbar's `style` object property that refers to the margin adjacent to the low-order end (edge) of the scrollbar, creating space between the end of the scrollbar and the edge of the content. */
    marginLeading: 'marginTop'|'marginLeft';
    /** The name of the scrollbar's `style` object property that refers to the margin adjacent to the high-order end (edge) of the scrollbar, creating space between the end of the scrollbar and the edge of the content. */
    marginTrailing: 'marginBottom'|'marginRight';
    /** The name of the scrollbar's `style` object property that refers to the broadness of the scrollbar. */
    thickness: 'width'|'height';
    /** The name of the `WheelEvent` property that holds the relevant delta value for the wheel movement. */
    delta: 'deltaY'|'deltaX';
}

/**
 * A callback function to be invoked whenever the scroll index changes.
 *
 * @remaks
 * - Specify a callback function in the `onchange` property of the `options` object parameter to the {@link FinBar|FinBar constructor}.
 * - Set or change the `onchange` property of your `FinBar` object directly.
 *
 * The function you supply is invoked to handle the following events:
 *
 * - Invoked once by calling the {@link FinBar#index|index} setter
 * - Invoked once by calling the {@link FinBar#resize|resize()} method
 * - Invoked repeatedly as user drags the scrollbar thumb
 * - Invoked repeatedly as user spins the mouse wheel (but only when mouse pointer is positioned inside the {@link FinBar#container|container} element)
 * - _If `.paging`:_ Invoked once when user clicks mouse in the _page-up region_ (the area of the scrollbar above the thumb)
 * - _If `.paging`:_ Invoked once when user clicks mouse in the _page-down region_ (the area of the scrollbar below the thumb)
 *
 * The handler's calling context (`this`) is the {@link FinBar} object. Note that this includes:
 *
 * - All the documented properties for the `FinBar` object
 * - Any additional "custom" properties you may have included in the `options` object
 *
 * And of course your handler will have access to all other objects in it's definition scope.
 *
 * @param index - The scrollbar index, always a value in the range {@link FinBar#min|min}..{@link FinBar#max|max}. (Same as `this.index`.)
 */
type finbarOnChange = (index: number) => void;

/**
 * A min/max range.
 */
interface RangeType {
    min: number;
    max: number;
}

interface Paging {
    up: (index: number) => number;
    down: (index: number) => number;
}

/**
 * As an "options" object, all properties herein are optional.
 * Omitted properties take on the default values shown; if no default value is shown, the option (and its functionality) are undefined.
 * All options, including any miscellaneous ("custom") options, become properties of `this`, the instantiated FinBar object.
 * As such, they are all available to the {@link finbarOnChange|onchange} callback function, which is called with `this` as its context.
 */
export interface FinBarOptions {
    /**
     * Overrides the default. See {@link FinBar#orientation|orientation} for details.
     * @default 'vertical'
     */
    orientation?: FinBar['orientation'];

    /**
     * See {@link FinBar#range|range} for details.
     * @default {min:0,max:100}
     */
    range?: FinBar['range'];

    /**
     * Overrides the default. See {@link FinBar#max|max} for details.
     * @default 100
     */
    max?: number;

    /**
     * Overrides the default. See {@link FinBar#index|index} for details.
     * This sets the initial position of the thumb after instantiation.
     */
    index?: FinBar['index'];

    /**
     * Overrides the default. See {@link FinBar#onchange|onchange} for details.
     */
    onchange?: FinBar['onchange'];

    /**
     * Overrides the default. See {@link FinBar#increment|increment} for details.
     * @default 1
     */
    increment?: FinBar['increment'];

    /**
     * Overrides the default. See {@link FinBar#paging|paging} for details.
     * @default true
     */
    paging?: FinBar['paging'];

    /**
     * Overrides the default. See {@link FinBar#barStyles|barStyles} for details.
     */
    barStyles?: FinBarStyles | null;

    /**
     * Overrides the prototype default. See {@link FinBar#deltaProp|deltaProp} for details.
     *
     * @remarks
     * The example values shown are for vertical and horizontal scrollbars, respectively.
     *
     * @example 'deltaY'
     * @example 'deltaX'
     */
    deltaProp?: string|null;

    /**
     * Value of multiplier for `WheelEvent#deltaX` (horizontal scrolling delta).
     * @default 1
     */
    deltaXFactor?: number;

    /**
     * Value of multiplier for `WheelEvent#deltaY` (vertical scrolling delta).
     * @default 1
     */
    deltaYFactor?: number;

    /**
     * Value of multiplier for `WheelEvent#deltaZ` (depth scrolling delta).
     * @default 1
     */
    deltaZFactor?: number;

    /**
     * Adds an additional class-name to the bar element's class list. See {@link FinBar#classPrefix|classPrefix} for details.
     */
    classPrefix?: string;

    /**
     * Determines where to insert the stylesheet. Passed to css-injector, the overloads are (from css-injector docs):
     *
     * - `undefined` type (or omitted): injects stylesheet at top of `<head>...</head>` element.
     * - `null` value: injects stylesheet at bottom of `<head>...</head>` element.
     * - `Element` type: injects stylesheet immediately before given element, wherever it is found.
     * - `string` type: injects stylesheet immediately before given first element found that matches the given css selector.
     *
     * In all cases, the built-in stylesheet will not be inserted again if already found in DOM.
     */
    cssStylesheetReferenceElement?: undefined|null|Element|string;

    /**
     * The element representing the content area. You only need to include this under special circumstances.
     * Omitting this options assumes the container to be the scrollbar's parent element, as in the following typical configuration:
     *
     *  * a container element, which contains two children:
     *   * a content element (typically larger than the container so it can scroll within it)
     *   * a scrollbar element (created by constructor; inserted into DOM by your code)
     *
     * Should you wish to use some other configuration of elements, you must indicate which element is the container the scrollbar is controlling.
     * For example, if you wish to position your scrollbar outside the content area rather than within it.
     *
     * @default bar.parentElement
     */
    container?: Element;

    /**
     * This option is used to bind the scroll bar to some real content for the purpose of scrolling.
     * Giving this option while omitting the `onchange` option signals the constructor to make this binding for you.
     * When the API sees this configuration, it makes the following settings for you (so don't try to set any of these yourself):
     *
     * - `this.min` = 0
     * - `this.max` = the content size - the container size - 1
     * - `this.increment` = the container size
     * - `this.onchange` = `this.scrollRealContent`
     *
     * This property is not normally used for any other purpose.
     * However, as with non-standard options, it will be mixed in to the object for future reference, such as in an onchange event handler.
     * Therefore, if you do give a value for this option while also giving a value for the `onchange` option, it will be not be used by the constructor but will be available to your handler.
     */
    content?: Element;

    /**
     * Optionally override the wheel normals.
     */
    normals?: WheelNormals;
}

/**
 * Table of wheel normals to webkit.
 *
 * This object is a dictionary of platform dictionaries, keyed by:
 * * `mac` — macOS
 * * `win` — Window
 *
 * Each platform dictionary is keyed by:
 * * `webkit` — Chrome, Opera, Safari
 * * `moz` — Firefox
 * * `ms` — IE 11 _(Windows only)_
 * * `edge` — Edge _(Windows only)_
 *
 * @todo add `linux` platform
 * @type {object}
 */
export type WheelNormals = Partial<Record<'mac'|'win', Partial<Record<'webkit'|'moz'|'ms'|'edge', number>>>>;
