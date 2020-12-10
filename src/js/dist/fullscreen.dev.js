"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FullScreen =
/*#__PURE__*/
function () {
  function FullScreen(player) {
    var _this = this;

    _classCallCheck(this, FullScreen);

    this.player = player;
    this.lastScrollPosition = {
      left: 0,
      top: 0
    };
    this.player.events.on('webfullscreen', function () {
      _this.player.resize();
    });
    this.player.events.on('webfullscreen_cancel', function () {
      _this.player.resize();

      _utils["default"].setScrollPosition(_this.lastScrollPosition);
    });

    var fullscreenchange = function fullscreenchange() {
      _this.player.resize();

      if (_this.isFullScreen('browser')) {
        _this.player.events.trigger('fullscreen');
      } else {
        _utils["default"].setScrollPosition(_this.lastScrollPosition);

        _this.player.events.trigger('fullscreen_cancel');
      }
    };

    var docfullscreenchange = function docfullscreenchange() {
      var fullEle = document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

      if (fullEle && fullEle !== _this.player.container) {
        return;
      }

      _this.player.resize();

      if (fullEle) {
        _this.player.events.trigger('fullscreen');
      } else {
        _utils["default"].setScrollPosition(_this.lastScrollPosition);

        _this.player.events.trigger('fullscreen_cancel');
      }
    };

    if (/Firefox/.test(navigator.userAgent)) {
      document.addEventListener('mozfullscreenchange', docfullscreenchange);
      document.addEventListener('fullscreenchange', docfullscreenchange);
    } else {
      this.player.container.addEventListener('fullscreenchange', fullscreenchange);
      this.player.container.addEventListener('webkitfullscreenchange', fullscreenchange);
      document.addEventListener('msfullscreenchange', docfullscreenchange);
      document.addEventListener('MSFullscreenChange', docfullscreenchange);
    }
  }

  _createClass(FullScreen, [{
    key: "isFullScreen",
    value: function isFullScreen() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'browser';

      switch (type) {
        case 'browser':
          // bom 全屏接口 判断是否已经全屏
          return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        case 'web':
          return this.player.container.classList.contains('dplayer-fulled');
      }
    }
  }, {
    key: "request",
    value: function request() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'browser';
      var anotherType = type === 'browser' ? 'web' : 'browser';
      var anotherTypeOn = this.isFullScreen(anotherType); // 是否有 web/browser全屏开启

      if (!anotherTypeOn) {
        this.lastScrollPosition = _utils["default"].getScrollPosition();
      }

      switch (type) {
        case 'browser':
          if (this.player.container.requestFullscreen) {
            this.player.container.requestFullscreen();
          } else if (this.player.container.mozRequestFullScreen) {
            this.player.container.mozRequestFullScreen();
          } else if (this.player.container.webkitRequestFullscreen) {
            this.player.container.webkitRequestFullscreen();
          } else if (this.player.video.webkitEnterFullscreen) {
            // Safari for iOS
            this.player.video.webkitEnterFullscreen();
          } else if (this.player.video.webkitEnterFullScreen) {
            this.player.video.webkitEnterFullScreen();
          } else if (this.player.container.msRequestFullscreen) {
            this.player.container.msRequestFullscreen();
          }

          break;

        case 'web':
          this.player.container.classList.add('dplayer-fulled');
          document.body.classList.add('dplayer-web-fullscreen-fix');
          this.player.events.trigger('webfullscreen');
          break;
      }

      if (anotherTypeOn) {
        this.cancel(anotherType);
      }

      this.player.template.controller.classList.add('dplayer-controller-comment-fullscreen');
      this.player.template.commentInput.focus();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'browser';

      switch (type) {
        case 'browser':
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.webkitCancelFullscreen) {
            document.webkitCancelFullscreen();
          } else if (document.msCancelFullScreen) {
            document.msCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }

          break;

        case 'web':
          this.player.container.classList.remove('dplayer-fulled');
          document.body.classList.remove('dplayer-web-fullscreen-fix');
          this.player.events.trigger('webfullscreen_cancel');
          break;
      }

      this.player.template.controller.classList.remove('dplayer-controller-comment-fullscreen');
    }
  }, {
    key: "toggle",
    value: function toggle() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'browser';

      if (this.isFullScreen(type)) {
        this.cancel(type);
      } else {
        this.request(type);
      }
    }
  }]);

  return FullScreen;
}();

var _default = FullScreen;
exports["default"] = _default;