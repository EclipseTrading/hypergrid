'use strict';

var assert = require('assert');

var instance = [{
    name:'extend',
    type: 'function'
}];

describe('Base', function(){
    describe('Module expected shape', function(){

        it('Should have the instance shape', function(){
            var base = require('../src/Base');

            instance.forEach(function(key){
                assert.equal(typeof(base[key.name]), key.type);
            });
        });
    });

    describe('extend', function(){
        it('Should create a new constructor', function(){
            var base = require('../src/Base');
            var myConstructor = base.extend('myConstructor', {a:'a'});

            assert.equal(typeof(myConstructor), 'function');
        });

        describe('Should extend with', function() {
            var base, MyConstructor, myObject;
            beforeEach(function() {
                base = require('../src/Base');
                MyConstructor = base.extend('MyConstructor', {a:'a'});
                myObject = new MyConstructor();
            });

            it('Should extend with HypergridError', function() {
                assert.equal(typeof(myObject.HypergridError), 'function');
            });

            it('Should extend with deprecated', function(){
                assert.equal(typeof(myObject.deprecated), 'function');
            });

            it('Should extend with unwrap', function(){
                assert.equal(typeof(myObject.unwrap), 'function');
            });
        });

    });

    describe('HypergridError', function(){
        it('should assign the message', function(){
            var base = require('../src/Base');
            var message = 'this is the message';
            var MyConstructor = base.extend('MyConstructor', {a:'a'});
            var myObject = new MyConstructor();
            var myError = new myObject.HypergridError(message);

            assert.equal(myError.message, message);

        });
    });

    describe('HypergridCanvas resize', function(){
        var previousWindow;
        var previousRAF;
        var previousCAF;
        var previousSetInterval;
        var previousClearInterval;

        beforeEach(function() {
            previousWindow = global.window;
            previousRAF = global.requestAnimationFrame;
            previousCAF = global.cancelAnimationFrame;
            previousSetInterval = global.setInterval;
            previousClearInterval = global.clearInterval;
            global.window = {
                CustomEvent: function() {},
                Event: { prototype: {} },
                devicePixelRatio: 1
            };
            global.requestAnimationFrame = function() { return 1; };
            global.cancelAnimationFrame = function() {};
            global.setInterval = function() { return 1; };
            global.clearInterval = function() {};
        });

        afterEach(function() {
            global.window = previousWindow;
            global.requestAnimationFrame = previousRAF;
            global.cancelAnimationFrame = previousCAF;
            global.setInterval = previousSetInterval;
            global.clearInterval = previousClearInterval;
        });

        it('should floor div bounding rect and align canvas CSS size with backing store across ratios', function(){
            var fs = require('fs');
            var path = require('path');
            var ts = require('typescript');

            var canvasTsPath = path.resolve(__dirname, '../src/lib/Canvas.ts');
            var source = fs.readFileSync(canvasTsPath, 'utf8');
            var transpiled = ts.transpileModule(source, {
                compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 }
            });

            var CanvasModule = { exports: {} };
            var customRequire = function(id) {
                if (id === './DragDropManager') {
                    return { DragDropManager: function() {} };
                }
                return require(id);
            };
            new Function('exports', 'require', 'module', '__filename', '__dirname', transpiled.outputText)(
                CanvasModule.exports,
                customRequire,
                CanvasModule,
                canvasTsPath,
                path.dirname(canvasTsPath)
            );
            var HypergridCanvas = CanvasModule.exports.HypergridCanvas;

            var canvasEl = { width: 0, height: 0, style: {} };
            var scaleCalls = [];
            var fakeInstance = {
                div: {},
                canvas: canvasEl,
                size: { width: 0, height: 0 },
                width: 0,
                height: 0,
                devicePixelRatio: 1,
                bodyZoomFactor: 1,
                bounds: null,
                component: {
                    properties: { useHiDPI: true },
                    grid: { sbVScroller: { thickness: 14 }, sbHScroller: { thickness: 14 } },
                    setBounds: function() {}
                },
                gc: {
                    scale: function(x, y) { scaleCalls.push([x, y]); }
                },
                getBoundingClientRect: function() {
                    return {
                        top: 27.6,
                        left: 0,
                        width: 627.2,
                        height: 303.6,
                        right: 627.2,
                        bottom: 331.2,
                        x: 0,
                        y: 27.6
                    };
                },
                getDivBoundingClientRect: HypergridCanvas.prototype.getDivBoundingClientRect,
                resize: HypergridCanvas.prototype.resize,
                resizeNotification: function() {},
                paintNow: function() {}
            };

            var divRect = fakeInstance.getDivBoundingClientRect();
            assert.strictEqual(divRect.width, 627);
            assert.strictEqual(divRect.height, 303);

            [0.7, 0.8, 0.9, 1, 1.25, 1.5].forEach(function(dpr) {
                global.window.devicePixelRatio = dpr;
                fakeInstance.resize();

                var ratio = fakeInstance.devicePixelRatio;
                assert.strictEqual(canvasEl.width, Math.round(fakeInstance.width * ratio));
                assert.strictEqual(canvasEl.height, Math.round(fakeInstance.height * ratio));
                assert.strictEqual(canvasEl.style.width, (canvasEl.width / ratio) + 'px');
                assert.strictEqual(canvasEl.style.height, (canvasEl.height / ratio) + 'px');
            });
        });
    });

});
