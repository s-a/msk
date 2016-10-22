"use strict";
var fs = require("fs");
var should = require("should");
var Keysim = require("Keysim");
var jsdom = require("jsdom");
var Mask = require("../lib/");
var testMasks = require("./testMasks.json");
var Dom = function(done){
  return jsdom.env({
    html: fs.readFileSync("index.html"),
    done: done
  });
}
var assert = require("assert");
var keyboard = Keysim.Keyboard.US_ENGLISH;


describe("msk", function () {
  it("should handle ip4 test mask", function (done) {
    Dom(function(err, window) {
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format();
      mask.val().should.equal("<test>: 111.11.1.1 <testing ip mask...>");
      mask.unmaskedValue().should.equal("111.11.1.1");
      done();
    });
  });


  it("should handle currency test mask", function (done) {
    Dom(function(err, window) {
      assert(err === null); 
			var mask = new Mask("txt-currency", testMasks.currency, window.document);
			mask.val("111.222").format();
      mask.val().should.equal("$ 111.222 <testing currency mask...>");
      mask.unmaskedValue().should.equal("111.222");
      done();
    });
  });

});

describe("navigation", function () {
  it("should navigate forward", function (done) {
    Dom(function(err, window) {  
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format(); 
      mask.cursorPosition().should.deepEqual({ start: 0, end: 0 });
      keyboard.dispatchEventsForAction("tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 8, end: 11 });
      keyboard.dispatchEventsForAction("ctrl+right", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 12, end: 14 });
      keyboard.dispatchEventsForAction("tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 15, end: 16 });
      keyboard.dispatchEventsForAction("ctrl+right", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 17, end: 18 });
      keyboard.dispatchEventsForAction("tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 17, end: 18 });
      done();
    });
  });

  it("should navigate backward", function (done) {
    Dom(function(err, window) {  
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format(); 
      keyboard.dispatchEventsForAction("tab", mask.el);
      keyboard.dispatchEventsForAction("tab", mask.el);
      keyboard.dispatchEventsForAction("tab", mask.el);
      keyboard.dispatchEventsForAction("tab", mask.el);
//      mask.cursorPosition().should.deepEqual({ start: 17, end: 18 });
      mask.cursorPosition().should.deepEqual({ start: 17, end: 18 });
      keyboard.dispatchEventsForAction("ctrl+left", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 15, end: 16 });
      keyboard.dispatchEventsForAction("shift+tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 12, end: 14 });
      keyboard.dispatchEventsForAction("shift+tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 8, end: 11 });
      keyboard.dispatchEventsForAction("shift+tab", mask.el);
      mask.cursorPosition().should.deepEqual({ start: 8, end: 11 });
      done();
    });
  }); 
}); 

describe("input", function () {
  it("should undo wrong input", function (done) {
    Dom(function(err, window) {
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format();
      
      mask.val("a complete wrong value format");
      (function(){
        mask.val().should.equal("<test>: 111.11.1.1 <testing ip mask...>");
        mask.unmaskedValue().should.equal("111.11.1.1");
      }).should.throw(); 
      done();
    });
  });  

  it("should handle input", function (done) {
    Dom(function(err, window) {
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format();
      mask.el.value = "<test>: 1121.11.1.1 <testing ip mask...>";
      mask.input();
      mask.unmaskedValue().should.equal("112.11.1.1");
      done();
    });
  });  
});