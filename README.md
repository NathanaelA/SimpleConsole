SimpleConsole
=============
License: MIT

Very simple console emulator for devices without a native console.   This is a really SIMPLE stupid console; but it works.  :-)
You can CTRL-Click on it to make it switch from top / bottom.

Basically just do a <script name="simpleconsole.js"></script> in your html page and it will do the rest.

If you wish to create a customized logger you can do:

var settings = {};
settings.force = true; 					// Replace the existing console (even built in one) with this one
settings.lines = 10;					// Automatically truncate the console.log to only keep 10 lines in memory (good for devices w/ little memory)
settings.height = 100;					// Make the console log file 100px tall
settings.top = true;					// Dock to the top of the screen instead of the bottom
settings.parseObject = ['[object HTML]']; 	// There are additional structures to parse as Object structures when passed in on to a console.

// This will re-create the console
createHTMLConsole(settings);

