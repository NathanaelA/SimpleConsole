/**
 * Copyright(c) 2013, Nathanael Anderson
 * Licensed under MIT license
 *
 * Version: 1.00
 */


var createHTMLConsole = function(settings) {
	"use strict";

	// Check for null/undefined settings object
	settings = settings || {force: false, lines: 0, height: 100, top: false, parseObject: []};

	// Are we going to replace the window.console if it exists
	if (!settings.force) {
		// Check to see if our Window . console is our declared version
		if (window.console && !window.console._idName) {
			return;
		}
	}

	// Get Max Number of Lines
	var maxLines, lineNumber = 0;
	if (!settings.lines) {
		maxLines = 0;
	} else {
		maxLines = parseInt(settings.lines, 10);
		if (isNaN(maxLines)) {
			maxLines = 0;
		}
	}

	// Get Max Height
	var maxHeight;
	if (!settings.height) {
		maxHeight = 100;
	} else {
		maxHeight = parseInt(settings.height, 10);
		if (isNaN(maxHeight)) {
			maxHeight = 100;
		}
	}


	// Setup Default ParseObject
	var parseObject = [];
	if (settings.parseObject !== null && settings.parseObject !== undefined) {
		parseObject = settings.parseObject;
	}
	var top = false;
	if (settings.top) {
		top = settings.top;
	}

	var recursive = [];
	var elementValue = function(element, name) {
		var results = [], arrayResults;
		var j, key;
		if (element === null) {
			return '[null]';
		}
		else if (element === undefined) {
			return '[undefined]';
		}
		if (recursive.indexOf(element) !== -1) {
			return ("[Object Recursion on " + name + "]");
		}
		var typeOfArg = typeof element;
		if (typeOfArg === "object") {
			typeOfArg = Object.prototype.toString.call(element);
		}
		//noinspection FallthroughInSwitchStatementJS
		switch (typeOfArg) {
			case 'string':
			case '[object String]':
			case 'boolean':
			case '[object Boolean]':
			case 'number':
			case '[object Number]':
			case '[object Date]':
				results.push(element.toString());
				break;

			case '[object Array]':
				arrayResults = [];
				for (j = 0; j < element.length; j++) {
					arrayResults.push(elementValue(element[j], j));
				}
				results.push("Array: [" + arrayResults.join(", ") + ']');
				break;

			case '[object Arguments]':
				for (j = 0; j < element.length; j++) {
					results.push(elementValue(element[j], j));
				}
				break;

			case '[object Object]':
			case '[object MouseEvent]':
			case '[object KeyboardEvent]':
				recursive.push(element);
				arrayResults = [];
				for (key in element) {
					if (element.hasOwnProperty(key)) {

						arrayResults.push(key + ": " + elementValue(element[key], key));
					}
				}
				results.push('Object {' + arrayResults.join(', ') + '}');
				break;

			default:
				if (element !== undefined && element !== null) {
					results.push(element);
				}
				if (parseObject.indexOf(typeOfArg) !== -1) {
					arrayResults = [];
					for (key in element) {
						if (element.hasOwnProperty(key)) {

							arrayResults.push(key + ": " + elementValue(element[key], key));
						}
					}
					results.push(typeOfArg + ' {' + arrayResults.join(', ') + '}');

				} else {
					results.push(typeOfArg);
				}
		}
		return results.join(' ');
	};

	// Setup Window Console
	window.console = {};
	if (window.console._idName === undefined || window.console._idName === null) {
		window.console._idName = "_console_" + (Math.random() * 100000);
	}

	// We are going to kinda "Emulate" a console
	window.console.log = function() {
		try {
			// WE DO NOT want to cache this, as the author of the page may re-write the entire page;
			// So we want to grab it if it exists; if it doesn't we will re-create it.
			var currentConsole = document.getElementById(window.console._idName);
			if (!currentConsole) {
				var body = document.body;
				lineNumber = 0;
				// This shouldn't occur as every document should have a body, but who knows some browser might not so we will play it "safe"...
				if (!body) {
					return;
				}
				currentConsole = document.createElement("div");
				currentConsole.id = window.console._idName;
				currentConsole.style.position = "fixed";
				currentConsole.style.left = currentConsole.style.right = "1px";
				if (top) {
					currentConsole.style.top = "0px";
				} else {
					currentConsole.style.bottom = "0px";
				}
				currentConsole.style.height = maxHeight + "px";
				currentConsole.style.overflow = "auto";
				currentConsole.style.zIndex = 10000;
				currentConsole.style.backgroundColor = '#FFF';
				currentConsole.style.border = "solid 2px #000";
				currentConsole.onclick = function(evt) {
					if (evt.ctrlKey) {
						if (currentConsole.style.bottom === "0px") {
							currentConsole.style.bottom = "";
							currentConsole.style.top = "0px";
						} else {
							currentConsole.style.bottom = "0px";
							currentConsole.style.top = "";
						}
					}
				};
				body.appendChild(currentConsole);
			}
			lineNumber++;
			var text = document.createElement("div");
			text.style.borderBottom = "1px solid #FFF";
			if ((lineNumber % 2) === 0) {
				text.style.backgroundColor = "#CCC";
			}
			text.innerHTML = elementValue(arguments, "");
			recursive = [];
			currentConsole.appendChild(text);
			if (maxLines > 0 && currentConsole.children.length > maxLines) {
				currentConsole.removeChild(currentConsole.children[0]);
			}
		} catch (e) {
			console.log("Exception occured in console.log: ", e);
		}
	};

  // Create the other "console" functions
  window.console.error = window.console.warn = window.console.debug = window.console.trace = window.console.info = window.console.log;
}
;

if (window && !window.console) {
	createHTMLConsole();
}