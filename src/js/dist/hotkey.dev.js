"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HotKey = function HotKey(player) {
  _classCallCheck(this, HotKey);

  if (player.options.hotkey) {
    document.addEventListener('keydown', function (e) {
      if (player.focus) {
        var tag = document.activeElement.tagName.toUpperCase();
        var editable = document.activeElement.getAttribute('contenteditable');

        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
          var event = e || window.event;
          var percentage;

          switch (event.keyCode) {
            case 32:
              event.preventDefault();
              player.toggle();
              break;

            case 37:
              event.preventDefault();

              if (player.options.live) {
                break;
              }

              player.seek(player.video.currentTime - 5);
              player.controller.setAutoHide();
              break;

            case 39:
              event.preventDefault();

              if (player.options.live) {
                break;
              }

              player.seek(player.video.currentTime + 5);
              player.controller.setAutoHide();
              break;

            case 38:
              event.preventDefault();
              percentage = player.volume() + 0.1;
              player.volume(percentage);
              break;

            case 40:
              event.preventDefault();
              percentage = player.volume() - 0.1;
              player.volume(percentage);
              break;
          }
        }
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    var event = e || window.event;

    switch (event.keyCode) {
      case 27:
        if (player.fullScreen.isFullScreen('web')) {
          player.fullScreen.cancel('web');
        }

        break;
    }
  });
};

var _default = HotKey;
exports["default"] = _default;