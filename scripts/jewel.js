var jewel = (function() {

    var settings = {
        rows: 8,
        cols: 8,
        baseScore: 100,
        numJewelTypes: 7
    };

	var scriptQueue = [],
		numResourcesLoaded = 0,
		numResources = 0,
		executeRunning = false;

	function executeScriptQueue() {
		var next = scriptQueue[0],
			first, script;
		if (next && next.loaded) {
			executeRunning = true;
		
			// remove the first element in the queue
			scriptQueue.shift();
			first = document.getElementsByTagName("script")[0];
			script = document.createElement("script");
			script.onload = function() {	
				if(next.callback) {
					next.callback();
				}
				// try to execute more scripts
				executeScriptQueue();
			};
			script.src = next.src;
			first.parentNode.insertBefore(script,first);
		}
		else {
			executeRunning = false;
		}
	
	}

	function load(src, callback) {
		var image, queueEntry;
		numResources++;

		// add this resource to the execution queue
		queueEntry = {
			src: src,
			callback: callback,
			loaded: false
		};
		scriptQueue.push(queueEntry);

		image = new Image();
		image.onload = image.onerror = function() {
			numResourcesLoaded++;
			queueEntry.loaded = true;
			if(!executeRunning) {
				executeScriptQueue();
			}
		};
		image.src = src;
	}

  function isStandalone() {
    return (window.navigator.standalone !== false);
  }

	function setup() {
    // disable native touchmove behavior to prevent overscroll
    jewel.dom.bind(document, "touchmove", function(event) {
      event.preventDefault();
    });
    if (isStandalone()) {
      jewel.showScreen("splash-screen");
    }
    else {
      showScreen("install-screen");
    }
	}

  // hide the active screen (if any) and show the screen
  // with specified id
  function showScreen(screenId) {
    var dom = jewel.dom,
      $ = dom.$,
      activeScreen = $("#game .screen.active")[0],
      screen = $("#" + screenId)[0];
    if (!jewel.screens[screenId]) {
      alert("This module is not implemented yet!");
      return;
    }
    if (activeScreen) {
      dom.removeClass(activeScreen, "active");
    }
    dom.addClass(screen, "active");

    jewel.screens[screenId].run();
  }

  function hasWebWorkers() {
        return ("Worker" in window);
  }

  function preload(src) {
    var image = new Image();
    image.src = src;
  }

	return {
		load: load,
		setup: setup,
        showScreen: showScreen,
        isStandalone: isStandalone,
        screens: {},
        settings: settings,
        hasWebWorkers : hasWebWorkers,
        preload : preload
	};
})();
