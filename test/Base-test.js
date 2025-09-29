
const assert = require('assert');
const Base = require('../dist/src/Base').default;

describe('Base', function(){
    describe('Module expected shape', function(){
        it('Should have the static extend function', function(){
            assert.equal(typeof Base.extend, 'function');
        });
        it('Should create an instance with instance methods', function(){
            var baseInstance = new Base();
            assert.equal(typeof baseInstance.notify, 'function');
            assert.equal(typeof baseInstance.unwrap, 'function');
            assert.equal(typeof baseInstance.mixIn, 'function');
            assert.equal(typeof baseInstance.createApply, 'function');
        });
    });


    describe('extend', function(){
        it('Should create a new constructor', function(){
            var myConstructor = Base.extend('myConstructor', {a:'a'});
            assert.equal(typeof(myConstructor), 'function');
        });

        describe('Should extend with', function() {
            var MyConstructor, myObject;
            beforeEach(function() {
                MyConstructor = Base.extend('MyConstructor', {a:'a'});
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
            var message = 'this is the message';
            var MyConstructor = Base.extend('MyConstructor', {a:'a'});
            var myObject = new MyConstructor();
            var myError = new myObject.HypergridError(message);
            assert.equal(myError.message, message);
        });
    });

});
