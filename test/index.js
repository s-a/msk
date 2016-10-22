"use strict";
var fs = require("fs");
/*var should = */require("should");
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
  it("should navigate with test mask", function (done) {
    Dom(function(err, window) { 
      assert(err === null); 
			var mask = new Mask("txt-ip4", testMasks.ip4, window.document);
			mask.val("111.11.1.1").format();
      //pressChar(9);
			//simulateKeyPress()
      done();
    });
  }); 
});
 