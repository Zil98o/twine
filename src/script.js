// TO IMPORT STYLES - LINEAR ICONS + GOOGLE FONT MONTSERRAT & MERRIWEATHER
importStyles(
  "https://cdn.linearicons.com/free/1.0.0/icon-font.min.css",
  "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
);

// SETTING ONCLICK FUNCTIONS FOR BUTTONS AS SOON AS PAGE IS LOADED
$(document).ready(function () {
  $("#sidebar-toggle-icon").click(function () {
    $("#sidebar").toggleClass("toggled");
  });

  $("#saves-button").click(function () {
    UI.saves();
  });

  $("#settings-button").click(function () {
    UI.settings();
  });

  $("#restart-button").click(function () {
    UI.restart();
  });

  $("#ui-dialog-close").html('<span class="lnr lnr-cross"></span>');
});
!(function () {
  $(document).on("click", "#backwards-button", function () {
    Engine.backward();
  });
})();
!(function () {
  $(document).on("click", "#forwards-button", function () {
    Engine.forward();
  });
})();
// MAKING SURE RETURN TO GAME LINKS DON'T CREATE A LOOP
$(document).on(":passagestart", function () {
  if (!tags().includes("noreturn")) {
    /* If it doesn't, then set $return to the current passage name. */
    State.variables.return = passage();
  }
});

// MAKING SURE PAGE SCROLLS TO TOP ON LONG PASSAGES
$(document).on(":passagedisplay", function () {
  $("#story").scrollTop(0);
});

// POPULATING SETTINGS

// CHANGE FONT FAMILY
var settingFontFamily = ["Vollkorn","Montserrat", "Merriweather", "Open Dyslexic"];
var setFont = function () {
  var passages = document.getElementById("passages");
  switch (settings.fontFamily) {
    case "Vollkorn":
      passages.style.fontFamily = "'Vollkorn', sans-serif";
      break;
  }
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
  label: "Change font",
  list: settingFontFamily,
  onInit: setFont,
  onChange: setFont,
});

// end change font family

// CHANGE FONT SIZE
var settingFontSize = ["16px", "18px", "20px", "22px", "24px"];
var setFontSize = function () {
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
  label: "Change font size",
  list: settingFontSize,
  onInit: setFontSize,
  onChange: setFontSize,
});

// CHANGE THEME
var themeList = ["Light Theme", "Dark Theme"];
var setTheme = function () {
  var html = $("html");

  html.removeClass("dark");

  switch (settings.theme) {
    case "Dark Theme":
      html.addClass("dark");
      break;
  }
};

Setting.addList("theme", {
  label: "Change theme",
  list: themeList,
  onInit: setTheme,
  onChange: setTheme,
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
    save.title = `Char: ${State.getVar("$pC.FName")}, Chapter: ${State.getVar(
      "$chapter"
    )}, Version: ${State.getVar("$version")}`;
  } else if (details.type == "autosave") {
    //If Autoname is not true but you have an autosave,
    save.title = `Char: ${State.getVar("$pC.FName")} Chapter: ${State.getVar(
      "$chapter"
    )} Version: ${State.getVar("$version")}`;
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
(function () {
  // set initial values
  var options = {
    current: 50, // default volume level
    rangeMax: 100,
    step: 1,
    setting: true,
  };
  Setting.load();
  if (options.setting && settings.volume) {
    options.current = parseInt(settings.volume);
  }
  var vol = {
    last: options.current,
    start: (options.current / options.rangeMax).toFixed(2),
  };
  function setVolume(val) {
    // function to update the volume level
    if (typeof val !== "number") val = Number(val);
    if (Number.isNaN(val) || val < 0) val = 0;
    if (val > 1) val = 1;
    options.current = Math.round(val * options.rangeMax);
    if (options.setting) {
      settings.volume = options.current;
      Setting.save();
    }
    if ($("input[name=volume]").val() != options.current) {
      $("input[name=volume]").val(options.current);
    }
    try {
      if (SimpleAudio) {
        if (typeof SimpleAudio.volume === "function") {
          SimpleAudio.volume(val);
        } else {
          SimpleAudio.volume = val;
        }
        return val;
      } else {
        throw new Error("Cannot access audio API.");
      }
    } catch (err) {
      // fall back to the wikifier if needed
      console.error(err.message, err);
      $.wiki("<<masteraudio volume " + val + ">>");
      return val;
    }
  }
  postdisplay["volume-task"] = function (taskName) {
    // fix the initial volume level display
    delete postdisplay[taskName];
    setVolume(vol.start);
  };
  $(document).on("input", "input[name=volume]", function () {
    // grab volume level changes
    var change = parseInt($("input[name=volume]").val());
    setVolume(change / options.rangeMax);
    vol.last = change;
  });
  Macro.add("volume", {
    // create the <<volume>> macro
    handler: function () {
      var wrapper = $(document.createElement("span"));
      var slider = $(document.createElement("input"));
      var className = "macro-" + this.name;
      slider.attr({
        id: "volume-control",
        type: "range",
        name: "volume",
        min: "0",
        max: options.rangeMax,
        step: options.step,
        value: options.current,
      }); // use '.macro-volume' and '#volume-control' to style slider
      wrapper.append(slider).addClass(className).appendTo(this.output);
    },
  });
  function updateVolume() {
    // add Setting API integratio
    setVolume(settings.volume / options.rangeMax);
  }
  if (options.setting) {
    if (Setting && Setting.addRange && typeof Setting.addRange === "function") {
      Setting.addRange("volume", {
        label: "Volume",
        min: 0,
        max: options.rangeMax,
        step: options.step,
        default: options.current,
        onInit: updateVolume,
        onChange: updateVolume,
      });
    } else {
      console.error(
        "This version of SugarCube does not include the `Settings.addRange()` method; please try updating to the latest version of SugarCube."
      );
    }
  }
})();
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
  $(document).on(
    "mouseenter",
    "#sidebar.toggled #sidebar-toggle-icon",
    function () {
      new Wikifier(null, '<<audio "breath" play>>');
    }
  );
})();
!(function () {
  $(document).on("mouseenter", "#sidebar-toggle-icon", function () {
    new Wikifier(null, '<<audio "link_hover" play>>');
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

(function () {
  // Check if the splash screen has been shown in this session
  var splashShown = sessionStorage.getItem("splashShown");

  // If the splash screen has been shown in this session, exit the function and do nothing
  if (splashShown) {
    return;
  }

  // Duration of each splash image's fade in and fade out.
  var fadeDuration = 1500; // in milliseconds

  // Delay before the second image appears.
  var switchImageDelay = 3000; // in milliseconds

  // First splash image.
  var $image1 = $('<img src="./images/k&m.png">').hide();
  // Second splash image.
  var $image2 = $('<img src="./images/twine-logo.jpg">').hide();

  // Display the splash screen with two images.
  $(document.body)
    .append('<div id="splash-screen"></div>')
    .find("#splash-screen")
    .append([$image1, $image2])
    .find("img")
    .eq(0) // Select the first image (index 0)
    .fadeIn(fadeDuration, function () {
      // After the first image has faded in, set a timeout to switch to the second image
      setTimeout(function () {
        $image1.fadeOut(fadeDuration, function () {
          // When the first image fades out, fade in the second image
          $image2.fadeIn(fadeDuration, function () {
            // After the second image has faded in, set a timeout to fade out the splash screen
            setTimeout(function () {
              $("#splash-screen").fadeOut(fadeDuration, function () {
                // When the splash screen fades out completely, remove it from the DOM
                $(this).remove();
              });
            }, fadeDuration);
          });
        });
      }, switchImageDelay);
    });

  // Set a flag in session storage to indicate that the splash screen has been shown in this session
  sessionStorage.setItem("splashShown", "true");
})();

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

// // Disable the context menu (right-click menu) to prevent copying
// $(document).on('contextmenu', function () {
// 	return false;
//   });

//   // Disable Ctrl+C (copy) and Ctrl+V (paste) keyboard shortcuts
//   $(document).keydown(function (event) {
// 	if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
// 	  event.preventDefault();
// 	}
//   });

// Set the favicon
$(document).ready(function () {
  var faviconPath = "./images/favicon.jpg"; // Update this with the correct path to your logo image
  $("head").append(
    '<link rel="icon" type="image/png" href="' + faviconPath + '">'
  );
});

// Get a reference to the sidebar-toggle-icon element
const sidebarToggleIcon = document.getElementById("sidebar-toggle-icon");

// Function to simulate a click event on the sidebar-toggle-icon
function simulateClick() {
  // Check if the element is not null before triggering the click event
  if (sidebarToggleIcon) {
    sidebarToggleIcon.click();
  }
}

// Event listener for keydown event on the document
document.addEventListener("keydown", function (event) {
  // Check if the pressed key is "m"
  if ((event.key === "m" && event.ctrlKey) || event.metaKey) {
    // Call the simulateClick function
    simulateClick();
  }
});

// Event listener for keydown event on the document
document.addEventListener("keydown", function (event) {
  // Check if the pressed key is "m"
  if (event.key === "ArrowLeft") {
    // Call the simulateClick function
    Engine.backward();
  }
});
// Event listener for keydown event on the document
document.addEventListener("keydown", function (event) {
  // Check if the pressed key is "m"
  if (event.key === "ArrowRight") {
    // Call the simulateClick function
    Engine.forward();
  }
});

// Event listener for keydown event on the document
document.addEventListener("keydown", function (event) {
  // Check if the pressed key is "m"
  if ((event.key === "v" && event.ctrlKey) || event.metaKey) {
    // Call the simulateClick function
    UI.saves();
  }
});

// Function to autosave the story data.
function autosave() {
  // Get the story's save data.
  const saveData = Save.get();

  // Check if both slot saves and autosave are available and ready.
  if (Save.ok()) {
    // Save the story data to the autosave slot without providing a title or metadata.
    Save.autosave.save();
  }
}

// Define the autosave interval in milliseconds (e.g., autosave every 5 minutes).
const autosaveInterval = 300000;

// Call the autosave function at the specified interval.
setInterval(autosave, autosaveInterval);

// Get the list items
const restartList = document.getElementById('restart-list');
const savesList = document.getElementById('saves-list');
const settingsList = document.getElementById('settings-list');

// Get the buttons
const restartButton = document.getElementById('restart-button');
const savesButton = document.getElementById('saves-button');
const settingsButton = document.getElementById('settings-button');

// Add event listeners to the list items
restartList.addEventListener('click', () => {
    // Simulate click on the restart button
    restartButton.click();
});

savesList.addEventListener('click', () => {
    // Simulate click on the saves button
    savesButton.click();
});

settingsList.addEventListener('click', () => {
    // Simulate click on the settings button
    settingsButton.click();
});

// force potrait
function lock(orientation) {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.msRequestFullScreen) {
    document.documentElement.msRequestFullScreen();
  }
  
  screen.orientation.lock(orientation);
}


document.addEventListener("DOMContentLoaded", function() {
  const inputField = document.getElementById("textbox-pcfname");

  inputField.addEventListener("click", function() {
    this.focus();
    const scrollHeight = this.scrollHeight;
    this.style.height = scrollHeight + "px";
  });

  inputField.addEventListener("blur", function() {
    this.style.height = ""; // Reset the height
  });
});

// message-macro.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2022-07-21, 3bdbdfbe5ae47a46e4f4e52766d78701939ae9a6
;setup.messageMacro={},setup.messageMacro.default="Help",Macro.add("message",{tags:null,handler:function(){var e=this.payload[0].contents,a=$(document.createElement("span")),s=$(document.createElement(this.args.includes("btn")?"button":"a")),t=$(document.createElement("span"));s.wiki(this.args.length>0&&"btn"!==this.args[0]?this.args[0]:setup.messageMacro.default).ariaClick(this.createShadowWrapper((function(){a.hasClass("open")?t.css("display","none").empty():t.css("display","block").wiki(e),a.toggleClass("open")}))),a.attr("id","macro-"+this.name+"-"+this.args.join("").replace(/[^A-Za-z0-9]/g,"")).addClass("message-text").append(s).append(t).appendTo(this.output)}});
// end message-macro.min.js

$(document).on(":passagedisplay", function () {
  $("#story").scrollTop(0);
  var stubStat = State.getVar("$pC.sb") + "%";
  $("#stub-stat").attr("style", "width: " + stubStat);
});
$(document).on(":passagedisplay", function () {
  $("#story").scrollTop(0);
  var emphStat = State.getVar("$pC.em") + "%";
  $("#emph-stat").attr("style", "width: " + emphStat);
});
$(document).on(":passagedisplay", function () {
  $("#story").scrollTop(0);
  var trustStat = State.getVar("$pC.tr") + "%";
  $("#trust-stat").attr("style", "width: " + trustStat);
});
$(document).on(":passagedisplay", function () {
  $("#story").scrollTop(0);
  var honestStat = State.getVar("$pC.hn") + "%";
  $("#honest-stat").attr("style", "width: " + honestStat);
});



$(document).ready(function() {
  
});

$(function() {
  // Use a timer to repeatedly check if the element is available
  var checkElementInterval = setInterval(function() {
    var stubStatElement = document.getElementById("stub-stat");
    if (stubStatElement) {
      clearInterval(checkElementInterval); // Stop the timer
      // Your code here, e.g., updating the progress bar width
      document.getElementById("stub-stat").style.width = `${State.getVar("$pC.sb")}%`
    }
  }, 100); // Check every 100 milliseconds
});

$(function() {
  // Use a timer to repeatedly check if the element is available
  var checkElementInterval = setInterval(function() {
    var stubStatElement = document.getElementById("trust-stat");
    if (stubStatElement) {
      // clearInterval(checkElementInterval); // Stop the timer
      // // Your code here, e.g., updating the progress bar width
      console.log(`${State.getVar("$pC.tr")}%`);
      document.getElementById("trust-stat").style.width = `${State.getVar("$pC.tr")}%`
    }
  }, 100); // Check every 100 milliseconds
});

$(function() {
  // Use a timer to repeatedly check if the element is available
  var checkElementInterval = setInterval(function() {
    var stubStatElement = document.getElementById("emph-stat");
    if (stubStatElement) {
      // clearInterval(checkElementInterval); // Stop the timer
      // Your code here, e.g., updating the progress bar width
      document.getElementById("emph-stat").style.width = `${State.getVar("$pC.em")}%`
    }
  }, 100); // Check every 100 milliseconds
});

$(function() {
  // Use a timer to repeatedly check if the element is available
  var checkElementInterval = setInterval(function() {
    var stubStatElement = document.getElementById("honest-stat");
    if (stubStatElement) {
      // clearInterval(checkElementInterval); // Stop the timer
      // Your code here, e.g., updating the progress bar width
      document.getElementById("honest-stat").style.width = `${State.getVar("$pC.hn")}%`
    }
  }, 100); // Check every 100 milliseconds
});