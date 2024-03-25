'use strict';

exports.finbars = `
/* scrollbar style - typically semi-transparent */
div.finbar-vertical, div.finbar-horizontal {
    background: #eeed;
    border-radius: 6px;
}
/* thumb style */
div.finbar-vertical > .thumb, div.finbar-horizontal > .thumb {
    background-color: lightgrey;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 6px;
    box-shadow: 0 0 2px #0009 inset;
}
/* thumb hover style */
div.finbar-vertical > .thumb.hover, div.finbar-horizontal > .thumb.hover {
    border-width: 0px;
    background-color: #bbb;
}

/* thumb active (click) style */
div.finbar-vertical > .thumb.hover:active, div.finbar-horizontal > .thumb.hover:active {
    background-color: #aaa;
}

/* vertical-specific styles */
div.finbar-vertical {
    top: 0; bottom: 0; /* stretched from top to bottom edges of container */
    right: 0; /* stuck to right edge of container */
    width: 12px;
}
div.finbar-vertical > .thumb {
    top: 0; /* optional: initial position of thumb within vertical scrollbar */
    right: 0;
    width: 12px;
}

/* horizontal-specific styles */
div.finbar-horizontal {
    left: 0; right: 0; /* stretched from left to right edges of container */
    bottom: 0; /* stuck to bottom edge of container */
    height: 12px;
}
div.finbar-horizontal > .thumb {
    left: 0; /* optional: initial position of thumb within horizontal scrollbar */
    bottom: 0;
    height: 12px;
}
`;

exports.grid = `
.hypergrid-container {
    position: relative;
    height: 500px;
}
.hypergrid-container > div:first-child {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.hypergrid-container > div:first-child > div.info {
    position: absolute;
    display: none; /* initially hidden */
    margin-top: 150px; /* to place below headers */
    color: #eee;
    text-shadow: 1px 1px #ccc;
    font-size: 36pt;
    font-weight: bold;
    text-align: center;
    top: 0; right: 0; bottom: 0; left: 0;
}
.hypergrid-textfield {
    position: absolute;
    font-size: 12px;
    color: black;
    background-color: ivory;
    box-sizing: border-box;
    margin: 0;
    padding: 0 5px;
    border: 0; /*border: 1px solid #777;*/
    outline: 0;
}

.hypergrid {
    touch-action: none;
}
`;
