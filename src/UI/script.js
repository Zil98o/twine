//--------TABLE OF CONTENTS--------
// A lot of the macro is from other people, 
//i think i just made the check button thingy for toggling bg image and my version of 'dark mode' 
//----UI BASE----
//--Destroy UI Bar
//--Reset Passage on top
//----SETTINGS----
//--Font Size
//--Font Type
//--Autosave
//--Naming Saves
//--Notifications
//--Theme Change
//----MACROS----
//--Liveupdate
//--Notify
//--------UI BASE--------
UIBar.destroy();
// reset passage to top
$(document).on(":passagedisplay", function () {
  $(".inside").scrollTop(0);
});
//Note: .inside has overflow set in CSS. If you change the name of that class or move the overflow, don't forget to edit this part, or it won't reset properly

//--------SETTINGS--------
//Note: The order you add the settings in this part will be the order you will see in the game.
Setting.addHeader("Font Settings");
//Note: the Header in the settings follow the <h2> HTML Class.
//--FONT SIZE--
var settingFontSize = ["80%","100%", "130%", "150%"];
var resizeFont = function () {
  var size = document.getElementById("passages");
  switch (settings.fontSize) {
    case "80%":
      size.style.fontSize = "80%";
      break;
  }
  var size = document.getElementById("passages");
  switch (settings.fontSize) {
    case "100%":
      size.style.fontSize = "100%";
      break;
  }
  switch (settings.fontSize) {
    case "130%":
      size.style.fontSize = "130%";
      break;
  }
  switch (settings.fontSize) {
    case "150%":
      size.style.fontSize = "150%";
      break;
  }
};
Setting.addList("fontSize", {
  label: "Change font size.",
  list: settingFontSize,
  default: "100%",
  onInit: resizeFont,
  onChange: resizeFont,
});
//--FONT TYPE--
var settingFontFamily = ["Serif", "Sans Serif", "OpenDyslexic"];
var fontFamily = function () {
  var $html = $("html");
  $html.removeClass("sansserif serif opendyslexic");
  switch (settings.fontFamily) {
    case "Serif":
      $html.addClass("serif");
      break;
  }
  switch (settings.fontFamily) {
    case "Sans Serif":
      $html.addClass("sansserif");
      break;
  }
  switch (settings.fontFamily) {
    case "OpenDyslexic":
      $html.addClass("opendyslexic");
      break;
  }
};
Setting.addList("fontFamily", {
  label: "Change font style.",
  list: settingFontFamily,
  default: "Sans Serif",
  onInit: fontFamily,
  onChange: fontFamily,
});
//Note: Any change in class name will need to be changed in the CSS too.

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
    save.title = State.getVar("$Name");
  } else if (details.type == "autosave") {
    //If Autoname is not true but you have an autosave,
    save.title = "Autosave - $Name";
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
Setting.addHeader("Other Settings");
//--NOTIFICATIONS--

//--------MACROS--------
//--LIVEUPDATE--
//Note: Used for the Menu Toggle. Can update the passage without reload. See Credits for manual link (Cycy)
(function () {
  "use strict";

  $(document).on(":liveupdate", function () {
    $(".header-container").trigger(":liveupdateinternal");
  });

  Macro.add(["update", "upd"], {
    handler: function handler() {
      $(document).trigger(":liveupdate");
    },
  });

  Macro.add(["live", "l", "lh"], {
    skipArgs: true,
    handler: function handler() {
      if (this.args.full.length === 0) {
        return this.error("no expression specified");
      }
      try {
        var statement = this.args.full;
        var result = toStringOrDefault(
          Scripting.evalJavaScript(statement),
          null
        );
        if (result !== null) {
          var lh = this.name === "lh";
          var $el = $("<span></span>")
            .addClass("macro-live")
            .wiki(lh ? Util.escape(result) : result)
            .appendTo(this.output);
          $el.on(
            ":liveupdateinternal",
            this.createShadowWrapper(function (ev) {
              var out = toStringOrDefault(
                Scripting.evalJavaScript(statement),
                null
              );
              $el.empty().wiki(lh ? Util.escape(out) : out);
            })
          );
        }
      } catch (ex) {
        return this.error(
          "bad evaluation: " + (_typeof(ex) === "object" ? ex.message : ex)
        );
      }
    },
  });

  Macro.add(["liveblock", "lb"], {
    tags: null,
    handler: function handler() {
      try {
        var content = this.payload[0].contents.trim();
        if (content) {
          var $el = $("<span></span>")
            .addClass("macro-live macro-live-block")
            .wiki(content)
            .appendTo(this.output);
          $el.on(
            ":liveupdateinternal",
            this.createShadowWrapper(function (ev) {
              $el.empty().wiki(content);
            })
          );
        }
      } catch (ex) {
        return this.error(
          "bad evaluation: " + (_typeof(ex) === "object" ? ex.message : ex)
        );
      }
    },
  });
})();
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

// volume slider, by chapel; for sugarcube 2 (mods by SjoerdHekking)
!(function () {
  function setVolume(val) {
    "number" != typeof val && (val = Number(val)),
      (Number.isNaN(val) || val < 0) && (val = 0.5),
      val > 1 && (val = 1),
      (settings.volume = 100 * val),
      Setting.save(),
      $("input[name='volume']").val() != settings.volume &&
        $("input[name='volume']").val(settings.volume);
    try {
      if (SimpleAudio)
        return (
          "function" == typeof SimpleAudio.volume
            ? SimpleAudio.volume(val)
            : (SimpleAudio.volume = val),
          val
        );
      throw new Error("Cannot access audio API.");
    } catch (err) {
      return (
        console.error(err.message, err),
        $.wiki("<<masteraudio volume " + val + ">>"),
        val
      );
    }
  }
  function updateVolume() {
    setVolume(settings.volume / 100);
  }
  Setting.addRange("volume", {
    label: "Volume: ",
    min: 0,
    max: 100,
    step: 1,
    default: 50,
    onInit: updateVolume,
    onChange: updateVolume,
  }),
    $(document).on("input", "input[name='volume']", function () {
      var change;
      setVolume(parseInt($("input[name='volume']").val()) / 100);
    }),
    Macro.add("volume", {
      handler: function () {
        var wrapper = $(document.createElement("span")),
          slider = $(document.createElement("input")),
          className = "macro-" + this.name;
        slider.attr({
          id: "volume-control",
          type: "range",
          name: "volume",
          min: 0,
          max: 100,
          step: 1,
          value: settings.volume,
        }),
          wrapper.append(slider).addClass(className).appendTo(this.output);
      },
    });
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

predisplay["Menu Return"] = function (taskName) {
  if (!tags().contains("noreturn")) {
    State.variables.return = passage();
  }
};
/*Limit story history*/
Config.history.maxStates = 3;

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


// JavaScript code to toggle background image and modify other element styles

// Function to enable background image and modify styles
function enableBackgroundImage() {
  document.body.style.backgroundImage = 'url(src/images/smoke.png)';
  document.body.style.backgroundColor = 'transparent';
  document.querySelector('.cover').style.backgroundColor = 'var(--cover)';
  document.querySelector('.cover').style.backgroundImage = 'url("./src/images/cover.jpg")';
  document.querySelector('.cover').style.boxShadow = '0 5px 10px 0 rgba(206, 4, 4, 0.5), 0 4px 20px 0 rgba(209, 9, 9, 0.5)';
}

// Function to disable background image and modify styles
function disableBackgroundImage() {
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = 'black';
  document.querySelector('.cover').style.backgroundColor = 'black';
  document.querySelector('.cover').style.backgroundImage = 'none';
  document.querySelector('.cover').style.boxShadow = 'none';
}

// Event listener for toggle button
var toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('change', function() {
  if (toggleButton.checked) {
      enableBackgroundImage();
  } else {
      disableBackgroundImage();
  }
});

/**toogle dark mode */
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  document.querySelector('.inside').style.backgroundColor = 'black';
  document.querySelector('.inside').style.color = 'white';
  document.querySelector('.inside').style.border = '1px solid white';
  document.querySelector('.navig').style.border = '1px solid white';
  document.querySelector('.macro-live').style.border = '1px solid white';
}

// Function to disable dark mode and revert styles
function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  document.querySelector('.inside').style.backgroundColor = 'var(--page)';
  document.querySelector('.inside').style.color = 'var(--text)';
  document.querySelector('.inside').style.border = 'none';
  document.querySelector('.navig').style.border = 'none';
  document.querySelector('.macro-live').style.border = 'none';
}

// Event listener for dark mode toggle button
var toggleDarkMode = document.getElementById('toggleDarkMode');

toggleDarkMode.addEventListener('change', function() {
  if (toggleDarkMode.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

