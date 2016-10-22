(function(){
	"use strict";

	var _to_ascii = {
		"188": "44",
		"109": "45",
		"190": "46",
		"191": "47",
		"192": "96",
		"220": "92",
		"222": "39",
		"221": "93",
		"219": "91",
		"173": "45",
		"187": "61", //IE Key codes
		"186": "59", //IE Key codes
		"189": "45"  //IE Key codes
	}

	var shiftUps = {
		"96": "~",
		"49": "!",
		"50": "@",
		"51": "#",
		"52": "$",
		"53": "%",
		"54": "^",
		"55": "&",
		"56": "*",
		"57": "(",
		"48": ")",
		"45": "_",
		"61": "+",
		"91": "{",
		"93": "}",
		"92": "|",
		"59": ":",
		"39": "\"",
		"44": "<",
		"46": ">",
		"47": "?"
	};

	var Mask = function(el, config, doc){
		this.config = config;
		doc = doc || document;
		if (typeof (el) === "string"){
			this.el = doc.getElementById(el);
		} else {
			this.el = el;
		}
		this.attachEventHandlers();
		return this;
	}

	/*function copyToClipboard(val){
		var dummy = document.createElement("input");
		document.body.appendChild(dummy);
		dummy.style.display = "none";
		dummy.setAttribute("id", "dummy_id");
		document.getElementById("dummy_id").value = val;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	}*/

	/*	Mask.prototype.diff = function(a1, a2) {

		var a = [], diff = [];
		a1 = Array.from(a1);
		a2 = Array.from(a2);

		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}

		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}

		for (var k in a) {
			diff.push(k);
		}
		console.log(diff);
		return diff[diff.length - 1];
	};*/

	Mask.prototype.attachEventHandlers = function() {
		var self = this;
		var userInputEventHandler = function(e){
			return self.input.apply(self, [e]);
		};
		var keydownEventHandler = function(e){
			return self.keydown.apply(self, [e]);
		};
		this.el.addEventListener("input", userInputEventHandler); 
		if (this.config.navigation){
			this.el.addEventListener("keydown", keydownEventHandler); 
		}
		/*this.el.addEventListener("copy", function(){
			setTimeout(function(){
				copyToClipboard(self.unmaskedValue());//window.prompt("Copy to clipboard: Ctrl+C, Enter", self.unmaskedValue() );  
			},100)
			return false;
		});  */
	};

	Mask.prototype.parse = function(regex, text) {	 
		var reg = regex;
		var result;
		var res = [];
		while ((result = reg.exec(text)) !== null) {
			res.push({
				fullMatch : result[0],
				content : result[1],
				index : result.index
			});
			if (res.length > 40){
				throw new Error("Something went wrong while parsing " + text + " :O(. Check the regular expression \"" + regex + "\"");
			}
		}
		return res;
	}

	/*function replaceAt(str, index, character) {
		return str.substr(0, index) + character + str.substr(index + character.length);
	}*/

	Mask.prototype.maxMaskItems = function() {
		var maxStaticMaskItems = this.parse(/{([^}]*)}/gi, this.config.value);
		return maxStaticMaskItems.length;
	};

	Mask.prototype.maxMaskItemLength = function(index) {
		var maxStaticMaskItems = this.parse(/{([^}]*)}/gi, this.config.value);
		if (maxStaticMaskItems[index]){
			return maxStaticMaskItems[index].content.length;
		} else {
			return 0;
		}
	};

	Mask.prototype.currentMaskItemLength = function(index) {
		var maxStaticMaskItems = this.parse(/{([^}]*)}/gi, this.config.value);
		return maxStaticMaskItems[index].content.length;
	};

	Mask.prototype.segmentPosition = function() {
		var pos = this.cursorPosition();
		var regExParts = new RegExp(this.config.parts, "gi");
		var maskItems = this.parse(regExParts, this.val());
		var segmentIndex = null;
		for(var i = 0 ; i < maskItems.length; i++){
			var item = maskItems[i];
			if (pos.start >= item.index - 1){
				segmentIndex = i;
			}
		}
		var result = {}; 
		var m = this.parse(regExParts, this.config.display);

		result.isafter = false; 
		result.isbefore = true;
		result.index = segmentIndex;

		var maxStaticMaskItems = this.maxMaskItems();
		if (result.index >= maxStaticMaskItems){
			result.index = maxStaticMaskItems.length - 1;
			result.isafter = true;
		}
		if (pos.start + 1 >= m[0].index){ 
			result.isbefore = false;
		}
		result.items = maskItems;
		return result;
	};

	Mask.prototype.format = function() {

		var regExParts = new RegExp(this.config.parts, "gi");
		var cursorPosition = this.cursorPosition();	 
		var staticMaskItems = this.parse(/{([^}]*)}/gi, this.config.display);
		var maskItems = this.parse(regExParts, this.val()); 

		var maskedText = this.config.display;
		var maskedTextSegment = this.config.display;
	
 
			for (var i = 0; i < staticMaskItems.length; i++) { 
				var item = staticMaskItems[i]; 
				maskedText = maskedText.replace("{" + item.content + "}", maskItems[i].content);
				maskedTextSegment = maskedTextSegment.replace("{" + item.content + "}", "{" + maskItems[i].content + "}");
			}
	
			this.val(maskedText);
			this.oldValue = maskedText;
 
		this.cursorPosition(cursorPosition);
		return this;
	};

	Mask.prototype.cursorPosition = function(position) {
		if (position === undefined){ 
			return {
				start : this.el.selectionStart,
				end : this.el.selectionEnd
			};
		} else {
			this.el.selectionStart = position.start;
			this.el.selectionEnd = position.end; 
		}
	};

	Mask.prototype.undo = function() {
		var cursorPosition = this.cursorPosition();
		cursorPosition.start--;
		cursorPosition.end--;
		this.val(this.oldValue);
		this.cursorPosition(cursorPosition);
	};

	Mask.prototype.selectSegment = function(index){
		var segments = this.segmentPosition();
		var result = false; 
		if (index === undefined){
			index = segments.index;
		} else {
			segments.index = index;
		}
		if (segments.isbefore){
			segments.index = index = 0;
		}
		
		if (segments.isafter){
			segments.index = index = this.maxMaskItems() - 1;
		}

		if (index >= 0 && index <= this.maxMaskItems() - 1){
			var seg = segments.items[segments.index];
			var pos = this.cursorPosition();
			pos.start = seg.index;
			pos.end = seg.index + seg.content.length;
			this.cursorPosition(pos);
			result = true;
		}
		return result;
	};

	Mask.prototype.selectAllSegments = function(){
		var segments = this.segmentPosition(); 
		var pos = this.cursorPosition();
		pos.start = segments.items[0].index;
		var maxItemIndex = this.maxMaskItems() - 1;
		pos.end = segments.items[maxItemIndex].index + segments.items[maxItemIndex].content.length;
		this.cursorPosition(pos);
		return this;
	}; 
	
	Mask.prototype.fromCharCode = function(e){
		var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

		if (_to_ascii.hasOwnProperty(key)) {
			key = _to_ascii[key];
		}
		
		if (!e.shiftKey && (key >= 65 && key <= 90)) {
			key = String.fromCharCode(key + 32);
		} else if (e.shiftKey && shiftUps.hasOwnProperty(key)) {
			key = shiftUps[key];
		} else {
			key = String.fromCharCode(key);
		}

		return key;

	};

	Mask.prototype.keys = function(e) { 
		var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		return {
			alt : e.altKey,
			ctrl : e.ctrlKey,
			shift : e.shiftKey,
			key : key,
			char : this.fromCharCode(e),
			tab : (key === 9),
			left : (key === 37),
			right : (key === 39),
			a : (key === 65),
			d : (key === 68)
		};
	}

	Mask.prototype.cancelEvent = function(e) {
		if (typeof e.stopPropagation == "function") {
			e.stopPropagation();
		}
		if (typeof e.preventDefault == "function") {
			e.preventDefault();
		}
		e.cancelBubble = true;
	}

	Mask.prototype.keydown = function(e) {
		var keys = this.keys(e); 
		this.key  = keys;
		if(keys.ctrl && keys.alt && keys.d ) {
			this.selectSegment();
			return false;
		}
		if(keys.ctrl && keys.alt && keys.a ) {
			this.selectAllSegments();
			return false;
		}
		
		if((keys.shift && keys.tab) || (keys.ctrl && keys.left)) { 
			var pos = this.segmentPosition()
			var index = pos.index;
			if (pos.isafter){
				index = this.maxMaskItems();
			}

			if (this.selectSegment(index - 1)) {
				this.cancelEvent(e);
				return false;
			}
			return true;
		}

		if(keys.tab || (keys.ctrl && keys.right)) { 
			var pos = this.segmentPosition()
			var index = pos.index;
			if (pos.isbefore){
				index = -1;
			} else {
				//debugger;
			}
			if (this.selectSegment(index + 1)) {
				this.cancelEvent(e);
				return false;
			}
			return true;
		}
	};

	var cutChar = function(text, index){
		var x = text.substring(0, index) + "" + text.substring(index + 1);
		return x;
	};

	Mask.prototype.processInput = function(/*e*/) {
		var regExParts = new RegExp(this.config.parts, "gi");
		var maskItems = this.parse(regExParts, this.val());
		var oldMaskItems = this.parse(regExParts, this.oldValue);
		var segmentPosition = this.segmentPosition(); 
		if (segmentPosition.isafter || segmentPosition.isbefore){
			this.undo();
		} else {
			if (this.val() !== this.oldValue && this.val().length > this.oldValue.length){
				// inserting characters to a segment cause a glitch when resulting length is greater than segment' s maxlength.
				// in this case we need to replace character at current cursor position. 
				var index = segmentPosition.index; 
				var currentMaskItemLength = maskItems[index].content.length;
				var maxMaskItemLength = this.maxMaskItemLength(index);
				console.log(currentMaskItemLength, maxMaskItemLength , segmentPosition);
				var cursorPosition = this.cursorPosition();
			
				if (index < oldMaskItems.length && oldMaskItems[index].content.length === maxMaskItemLength){ 
					var newText = this.val();
					var newText = cutChar(newText, cursorPosition.start);
					this.val(newText); 
					this.cursorPosition(cursorPosition);

					var freshSegmentPosition = this.segmentPosition();
					var idx = (index > 0 ? index - 1 : 0);
					var nextSegmentPost = freshSegmentPosition.items[idx].index + maskItems[idx].content.length;
					if (cursorPosition.start === nextSegmentPost){ 
						cursorPosition.start = cursorPosition.end = segmentPosition.items[index].index + 1 ;
						this.cursorPosition(cursorPosition);
					}
				}			
			}
		}
		if (!this.validate()){
			this.undo();
		}
	};
	Mask.prototype.input = function(/*e*/) { 
		if (this.val().trim() === ""){
			this.oldValue = "";
			this.val("");
		} else {
			this.processInput();
			this.format(); 
		} 
	};

	Mask.prototype.validate = function() {
		var testString = this.unmaskedValue();
		var regEx = new RegExp(this.config.test, "gi");
		return regEx.test(testString);
	};

	Mask.prototype.val = function(newValue) {
		if(newValue === undefined){
			return this.el.value;
		} else {
			this.el.value = newValue;
			return this;
		}
	};

	Mask.prototype.unmaskedValue = function() {
		var regExParts = new RegExp(this.config.parts, "gi"); 
		var maskItems = this.parse(regExParts, this.val());
		var maskedText = this.config.value;
		if (maskItems.length === 0){
			maskedText = this.oldValue;
		} else {
			var staticMaskItems = this.parse(/{([^}]*)}/gi, this.config.value);

			for (var i = 0; i < staticMaskItems.length; i++) { 
				var item = staticMaskItems[i]; 
				if (maskItems[i] === undefined){
					this.oldValue = this.val();
					break;
				}
				maskedText = maskedText.replace("{" + item.content + "}", maskItems[i].content);
			} 
		}
		return maskedText
	};
  



	/*window.observeDOM = (function(){
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			eventListenerSupported = window.addEventListener;

		return function(obj, callback){ 
			if( MutationObserver ){
				// define a new observer
				var obs = new MutationObserver(function(mutations, observer){
					if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
						callback();
				});
				// have the observer observe foo for changes in children
				obs.observe( obj, { childList:true, subtree: true });
			}
			else if( eventListenerSupported ){
				obj.addEventListener("DOMNodeInserted", callback, false);
				obj.addEventListener("DOMNodeRemoved", callback, false);
			}
		}
	})();*/


	// todo:  
	// do not jump cursor if maxlength is not reached
  
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = Mask;
    } else {
        if (typeof define === "function" && define.amd) {
            define([], function() {
                return Mask;
            });
        } else {
            window.Msk = Mask;
        }
    }  
})();