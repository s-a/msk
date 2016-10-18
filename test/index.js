"use strict";
var fs = require("fs");
var path = require("path");
var jsdom = require("jsdom");
var Dom = function(done){
  return jsdom.env({
    html: fs.readFileSync("index.html"),
    scripts: [
      path.join(__dirname, "..", "lib/index.js")
    ],
    features: {
     // FetchExternalResources: ["script"],
     // ProcessExternalResources: ["script"]
    },
    done: done
  });
}
var assert = require("assert");
//var msk = require("../lib");
/*var newModuleWrap = function(script) {
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

var ModedModule = function (ironNodeSettings) {
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
  it("should return a value", function (done) {
    
    var dom = new Dom(function(err, window) {
      assert(err === null);
      assert(true, window.mask.val() === "155.125.25.25");
      done();
    });
  });
});
