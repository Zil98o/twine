// TO IMPORT STYLES - LINEAR ICONS + GOOGLE FONT MONTSERRAT & MERRIWEATHER
importStyles(
	"https://cdn.linearicons.com/free/1.0.0/icon-font.min.css",
	"https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

// SETTING ONCLICK FUNCTIONS FOR BUTTONS AS SOON AS PAGE IS LOADED
$(document).ready(function() {
	$("#sidebar-toggle-icon").click(function(){
		$("#sidebar").toggleClass("toggled");
	});
	
		$("#saves-button").click(function() {
		UI.saves();
	});
	
	$("#settings-button").click(function() {
		UI.settings();
	});
	
	$("#restart-button").click(function() {
		UI.restart();
	});
	
	$("#backwards-button").click(function() {
	Engine.backward();
});

	$("#forwards-button").click(function() {
	Engine.forward();
});
	
	$("#ui-dialog-close").html('<span class="lnr lnr-cross"></span>');
	
});

// MAKING SURE RETURN TO GAME LINKS DON'T CREATE A LOOP
$(document).on(":passagestart", function() {
	if (!tags().includes("noreturn")) {
		/* If it doesn't, then set $return to the current passage name. */
		State.variables.return = passage();
	}	
});

// MAKING SURE PAGE SCROLLS TO TOP ON LONG PASSAGES
$(document).on(":passagedisplay", function() {
	$("#story").scrollTop(0);
});

// POPULATING SETTINGS

// CHANGE FONT FAMILY
var settingFontFamily = ["Montserrat", "Merriweather", "Open Dyslexic"];
var setFont = function() {
	var passages = document.getElementById("passages");
	switch (settings.fontFamily) {
		case "Montserrat":
			passages.style.fontFamily = "'Montserrat', sans-serif";
			break;
	}
	switch (settings.fontFamily) {
		case "Merriweather":
			passages.style.fontFamily = "'Merriweather', serif";
			break;
	}
	switch (settings.fontFamily) {
		case "Open Dyslexic":
			passages.style.fontFamily = "'Dyslexic', serif";
			break;
	}
};

Setting.addList("fontFamily", {
	label		: "Change font",
	list		: settingFontFamily,
	onInit		: setFont,
	onChange	: setFont
});

// end change font family

// CHANGE FONT SIZE
var settingFontSize = ["16px", "18px", "20px", "22px", "24px"];
var setFontSize = function() {
	switch (settings.fontSize) {
		case "16px":
			passages.style.fontSize = "16px";
			break;
	}
	switch (settings.fontSize) {
		case "18px":
			passages.style.fontSize = "18px";
			break;
	}
	switch (settings.fontSize) {
		case "20px":
			passages.style.fontSize = "20px";
			break;
	}
	switch (settings.fontSize) {
		case "22px":
			passages.style.fontSize = "22px";
			break;
	}	
	switch (settings.fontSize) {
		case "24px":
			passages.style.fontSize = "24px";
			break;
	}
};

Setting.addList("fontSize", {
	label		: "Change font size",
	list		: settingFontSize,
	onInit		: setFontSize,
	onChange	: setFontSize
});

// CHANGE THEME
var themeList = ["Light Theme", "Dark Theme"];
var setTheme = function() {
	var html = $("html");
	
	html.removeClass("dark");
	
	switch(settings.theme) {
		case "Dark Theme":
			html.addClass("dark");
			break;
	}
};

Setting.addList("theme", {
	label			: "Change theme",
	list			: themeList,
	onInit		:	setTheme,
	onChange	: setTheme
});

Setting.addHeader("Save Settings");
//--AUTOSAVE--
//-- > config.saves.autosave = true; <-- if you want the autosave to be on for all passages. Delete the setting toggle below in that case.
config.saves.isAllowed = function () {
  if (tags().includes("noreturn")) {
    return false; //players can't save if the passage has a tag 'noreturn' (in this templage: title page and Next passage)
  }
  return true;
};

Config.saves.autosave = function () {
  if (settings.autosave) {
    return true;
  }
};

Setting.addToggle("autosave", {
  label: "<b>Autosaves</b>",
  default: false,
});
//--NAMING SAVES--
Config.saves.onSave = function (save, details) {
  if (settings.autoname) {
    //If Autoname is true, the save will be named by what's in the brakets. Can be variable, passage, whatever you want.
    save.title = State.getVar("$pC.FName");
  } else if (details.type == "autosave") {
    //If Autoname is not true but you have an autosave,
    save.title = "Autosave - $pC.FName";
    //Otherwise, you get a prompt to enter the name
  } else {
    save.title = prompt("Enter Save Name:", save.title);
  }
};
Setting.addToggle("autoname", {
  label:
    "<b>Autoname</b><br>If enabled the saves will be named after your character.",
  default: false,
});

//--NOTIFY--
//Note: See Credits for manual link (Chapel)
(function () {
	var DEFAULT_TIME = 2000; // default notification time (in MS)
	var isCssTime = /\d+m?s$/;
	$(document.body).append("<div id='notify'></div>");
	$(document).on(":notify", function (ev) {
	  if (ev.message && typeof ev.message === "string") {
		// trim message
		ev.message.trim();
		// classes
		if (ev.class) {
		  if (typeof ev.class === "string") {
			ev.class = "open macro-notify " + ev.class;
		  } else if (Array.isArray(ev.class)) {
			ev.class = "open macro-notify " + ev.class.join(" ");
		  } else {
			ev.class = "open macro-notify";
		  }
		} else {
		  ev.class = "open macro-notify";
		}
  
		// delay
		if (ev.delay) {
		  if (typeof ev.delay !== "number") {
			ev.delay = Number(ev.delay);
		  }
		  if (Number.isNaN(ev.delay)) {
			ev.delay = DEFAULT_TIME;
		  }
		} else {
		  ev.delay = DEFAULT_TIME;
		}
  
		$("#notify").empty().wiki(ev.message).addClass(ev.class);
  
		setTimeout(function () {
		  $("#notify").removeClass();
		}, ev.delay);
	  }
	});
  
	function notify(message, time, classes) {
	  if (typeof message !== "string") {
		return;
	  }
  
	  if (typeof time !== "number") {
		time = false;
	  }
  
	  $(document).trigger({
		type: ":notify",
		message: message,
		delay: time,
		class: classes || "",
	  });
	}
  
	// <<notify delay 'classes'>> message <</notify>>
	Macro.add("notify", {
	  tags: null,
	  handler: function () {
		// set up
		var msg = this.payload[0].contents,
		  time = false,
		  classes = false,
		  i;
  
		// arguments
		if (this.args.length > 0) {
		  var cssTime = isCssTime.test(this.args[0]);
		  if (typeof this.args[0] === "number" || cssTime) {
			time = cssTime ? Util.fromCssTime(this.args[0]) : this.args[0];
			classes = this.args.length > 1 ? this.args.slice(1).flatten() : false;
		  } else {
			classes = this.args.flatten().join(" ");
		  }
		}
  
		// fire event
		notify(msg, time, classes);
	  },
	});
  
	setup.notify = notify;
  })();
  
  // preload.min.js, for SugarCube 2, by Chapel
  // v1.0.0, 2022-07-21, 3bdbdfbe5ae47a46e4f4e52766d78701939ae9a6
  !(function () {
	"use strict";
	function t(t, r) {
	  var e = 0,
		o = t.length;
	  if (0 === o) throw new Error("No URLs to preload!");
	  t.forEach(function (t) {
		!(function (t, r) {
		  var e = new Image();
		  (e.onload = r), (e.onerror = r), (e.src = t);
		})(t, function () {
		  ++e === o && r();
		});
	  });
	}
	function r() {
	  return State.length <= 0;
	}
	function e() {
	  var e = [].slice.call(arguments).flatten(),
		o = !!r() && LoadScreen.lock();
	  return (
		t(e, function () {
		  o && LoadScreen.unlock(o);
		}),
		o
	  );
	}
	(setup.preload = e),
	  (setup.preload.force = !1),
	  Macro.add("preload", {
		handler: function () {
		  if (!r() && !setup.preload.force)
			return this.error(
			  "Attempting to preload images outside of `StoryInit` or similar can cause performance issues. Set `setup.preload.force` to `true` if you want to do it anyway."
			);
		  e(
			this.args.flatten().filter(function (t) {
			  return "string" == typeof t;
			})
		  );
		},
	  });
  })();
  // end preload.min.js

  // ADD volume slider, still from HiEv (who I think modified Chapel's code)
(function () { // set initial values
	var options = {
		current  : 50,  // default volume level
		rangeMax : 100,
		step	 : 1,
		setting  : true
	};
	Setting.load();
	if (options.setting && settings.volume) {
		options.current = parseInt(settings.volume);
	}
	var vol = {
		last: options.current,
		start: (options.current / options.rangeMax).toFixed(2)
	};
	function setVolume (val) { // function to update the volume level
		if (typeof val !== 'number') val = Number(val);
		if (Number.isNaN(val) || val < 0) val = 0;
		if (val > 1) val = 1;
		options.current = Math.round(val * options.rangeMax);
		if (options.setting) {
			settings.volume = options.current;
			Setting.save();
		}
		if ($('input[name=volume]').val() != options.current) {
			$('input[name=volume]').val(options.current);
		}
		try {
			if (SimpleAudio) {
				if (typeof SimpleAudio.volume === 'function') {
					SimpleAudio.volume(val);
				} else {
					SimpleAudio.volume = val;
				}
				return val;
			} else {
				throw new Error('Cannot access audio API.');
			}
		} catch (err) { // fall back to the wikifier if needed
			console.error(err.message, err);
			$.wiki('<<masteraudio volume ' + val + '>>');
			return val;
		}
	}
	postdisplay['volume-task'] = function (taskName) { // fix the initial volume level display
		delete postdisplay[taskName];
		setVolume(vol.start);
	};
	$(document).on('input', 'input[name=volume]', function() { // grab volume level changes
		var change = parseInt($('input[name=volume]').val());
		setVolume(change / options.rangeMax);
		vol.last = change;
	});
	Macro.add('volume', { // create the <<volume>> macro
		handler : function () {
			var wrapper = $(document.createElement('span'));
			var slider = $(document.createElement('input'));
			var className = 'macro-' + this.name;
			slider.attr({
				id		: 'volume-control',
				type	: 'range',
				name	: 'volume',
				min		: '0',
				max		: options.rangeMax,
				step	: options.step,
				value	: options.current
			}); // use '.macro-volume' and '#volume-control' to style slider
			wrapper.append(slider).addClass(className).appendTo(this.output);
		}
	});
	function updateVolume () { // add Setting API integratio
		setVolume(settings.volume / options.rangeMax);
	}
	if (options.setting) {
		if (Setting && Setting.addRange && typeof Setting.addRange === 'function') {
			Setting.addRange('volume', {
    		label : "Volume",
				min : 0,
				max : options.rangeMax,
				step : options.step,
				default : options.current,
				onInit : updateVolume,
				onChange : updateVolume
			});
		} else {
			console.error('This version of SugarCube does not include the `Settings.addRange()` method; please try updating to the latest version of SugarCube.');
		}
	}
}());
// end volume slider

/*Sound on Link Click*/
!(function () {
  $(document).on("click", "a", function () {
    new Wikifier(null, '<<audio "link_click" play>>');
  });
})();
!(function () {
  $(document).on("mouseenter", "a", function () {
    new Wikifier(null, '<<audio "link_hover" play>>');
  });
})();

!(function () {
	$(document).on("click", "button", function () {
	  new Wikifier(null, '<<audio "link_click" play>>');
	});
  })();
!(function () {
	$(document).on("mouseenter", "button", function () {
	  new Wikifier(null, '<<audio "link_hover" play>>');
	});
})();


!(function () {
	$(document).on("click", ".story-tools-list", function () {
	  new Wikifier(null, '<<audio "link_click" play>>');
	});
})();
!(function () {
	$(document).on("mouseenter", ".story-tools-list", function () {
	  new Wikifier(null, '<<audio "link_hover" play>>');
	});
})();


!(function () {
	$(document).on("click", "#sidebar-toggle-icon", function () {
	  new Wikifier(null, '<<audio "ui" play>>');
	});
})();
!(function () {
	$(document).on("mouseenter", "#sidebar-toggle-icon", function () {
	  new Wikifier(null, '<<audio "breath" play>>');
	});
})();
// Fading Macro set, by chapel; for SugarCube 2
// version 1.1.0

// <<fadein>> macro
Macro.add("fadein", {
  tags: null,
  handler: function () {
    var $wrapper = $(document.createElement("span"));
    var content = this.payload[0].contents,
      time,
      delay;

    if (this.args.length === 0) {
      return this.error("no arguments given");
    }

    time = Util.fromCssTime(this.args[0]);
    delay = this.args.length > 1 ? Util.fromCssTime(this.args[1]) : 0;

    $wrapper
      .wiki(content)
      .addClass("macro-" + this.name)
      .appendTo(this.output)
      .hide()
      .delay(delay)
      .fadeIn(time);
  },
});

// <<fadeout>> macro
Macro.add("fadeout", {
  tags: null,
  handler: function () {
    var $wrapper = $(document.createElement("span"));
    var content = this.payload[0].contents,
      time,
      delay;

    if (this.args.length === 0) {
      return this.error("no arguments given");
    }

    time = Util.fromCssTime(this.args[0]);
    delay = this.args.length > 1 ? Util.fromCssTime(this.args[1]) : 0;

    $wrapper
      .wiki(content)
      .addClass("macro-" + this.name)
      .appendTo(this.output)
      .delay(delay)
      .fadeOut(time);
  },
});

/* Splash Screen by MadExile */
// (function () {
//   // Duration of the splash image's fade in.
//   var fadeIn = 2000; // in milliseconds

//   // Delay before the splash screen begins to fade out.
//   var linger = 6000; // in milliseconds

//   // Duration of the splash screen's fade out.
//   var fadeOut = 1500; // in milliseconds

//   // Splash image.
//   var $image = $('<img src="src/images/splashwarn.png">').hide();

//   // Display the splash screen.
//   $(document.body)
//     .append('<div id="splash-screen"></div>')
//     .find("#splash-screen")
//     .append($image)
//     .find("img")
//     .fadeIn(fadeIn)
//     .end()
//     .delay(linger)
//     .fadeOut(fadeOut);

//   // Removal of the splash screen.
//   setTimeout(function () {
//     $("#splash-screen").remove();
//   }, fadeIn + linger + fadeOut + 1000);
// })();

/** Fullscreen */
var settingFullscreenHandler = function () {
	if (settings.fullscreen) {
	  // is true
  
	  Fullscreen.request();
	} else {
	  // is false
  
	  Fullscreen.exit();
	}
  };
  
  Setting.addToggle("fullscreen", {
	label: "<b>FULLSCREEN</b><br>Toggles fullscreen mode.",
  
	default: false,
  
	onInit: settingFullscreenHandler,
  
	onChange: settingFullscreenHandler,
  });
  
  