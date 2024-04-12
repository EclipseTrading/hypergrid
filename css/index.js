'use strict';

exports.finbars = `
/* scrollbar style - typically semi-transparent */
div.finbar-vertical, div.finbar-horizontal {
    background: #fff;
}
div.finbar-vertical._translucent, div.finbar-horizontal._translucent {
    opacity: .75;
}
/* thumb style */
div.finbar-vertical > .thumb, div.finbar-horizontal > .thumb {
    background-color: #dfe3e8;
    border: 1px solid white; /* white border can still be grabbed */
    border-radius: 3px;
    box-shadow: inset 0 0 0 0.5px #585858; /* Use inset box shadow as fake border. */
}
/* thumb hover style */
div.finbar-vertical > .thumb.hover, div.finbar-horizontal > .thumb.hover {
    /* border-width: 0px; */
    background-color: #d0d6dc;
}

/* thumb active (click) style */
div.finbar-vertical > .thumb.hover:active, div.finbar-horizontal > .thumb.hover:active {
    background-color: #c3c9cf;
}

/* vertical-specific styles */
div.finbar-vertical {
    top: 0; bottom: 0; /* stretched from top to bottom edges of container */
    right: 0; /* stuck to right edge of container */
    width: 14px;
}
div.finbar-vertical > .thumb {
    top: 0; /* optional: initial position of thumb within vertical scrollbar */
    right: 0;
    width: 14px;
}

/* horizontal-specific styles */
div.finbar-horizontal {
    left: 0; right: 0; /* stretched from left to right edges of container */
    bottom: 0; /* stuck to bottom edge of container */
    height: 14px;
}
div.finbar-horizontal > .thumb {
    left: 0; /* optional: initial position of thumb within horizontal scrollbar */
    bottom: 0;
    height: 14px;
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
