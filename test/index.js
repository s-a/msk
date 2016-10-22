"use strict";
var fs = require("fs");
var should = require("should");
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
/*
  var newModuleWrap = function(script) {
	var nodeParms = ["exports", "require", "module", "__filename", "__dirname", "process", "global"];
	if (settings.nodeModule.arguments && isArray(settings.nodeModule.arguments)){
		for (var i = 0; i < settings.nodeModule.arguments.length; i++) {
			var parm = settings.nodeModule.arguments[i];
			nodeParms.push(parm);
		}
	}

	var w = [];
	w.push("(function (" + nodeParms.join(", ") + ") { \n");

	if(settings.nodeModule && settings.nodeModule.scriptInjection){
		script = settings.nodeModule.scriptInjection  + "\n" + script;
	}

	w.push("\n});");

	return w[0] + script + w[1];
};

var ModdedModule = function (ironNodeSettings) {
	settings = ironNodeSettings;
	console.log(settings);
	if (ironNodeSettings && ironNodeSettings.nodeModule){
		(function(moduleWrapMethode) {
			Module.wrap = function(script) {
				return moduleWrapMethode(script); // Call the new wrapper function
			};
		}(newModuleWrap)); // Pass original function to IIFE
	}
};*/

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
 