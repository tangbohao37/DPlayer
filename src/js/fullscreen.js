import utils from './utils';

class FullScreen {
    constructor(player) {
        this.player = player;
        this.lastScrollPosition = { left: 0, top: 0 };
        this.player.events.on('webfullscreen', () => {
            // if (this.player.template.isShowBottomArea) {
            //     this.player.comment.showInner();
            //     this.player.danmaku.showInnerDanBox();
            //     this.player.comment.commentInput.focus();
            // }

            // TODO: 对外暂时未区分 浏览器全屏和web全屏
            this.player.events.trigger('fullscreen');
            this.player.resize();
        });
        this.player.events.on('webfullscreen_cancel', () => {
            // if (this.player.template.isShowBottomArea) {
            // this.player.bottomArea.toggle();
            //     this.player.comment.hideInner();
            //     this.player.danmaku.hideInnerDanBox();
            // }

            // TODO: 对外暂时未区分 浏览器全屏和web全屏
            this.player.events.trigger('fullscreen_cancel');
            this.player.resize();
            utils.setScrollPosition(this.lastScrollPosition);
        });

        const fullscreenchange = () => {
            // 全屏改变事件
            this.player.resize();
            if (this.isFullScreen('browser')) {
                // 当前是浏览器全屏
                this.player.events.trigger('fullscreen');
                // if (this.player.template.isShowBottomArea) {
                //     this.player.danmaku.showInnerDanBox();
                //     this.player.comment.showInner();
                //     this.player.comment.commentInput.focus();
                // this.player.bottomArea.hide();
                // }
            } else {
                //  取消全屏
                utils.setScrollPosition(this.lastScrollPosition);
                // 触发外部事件
                this.player.events.trigger('fullscreen_cancel');

                // 由全屏切换为普通网页模式
                if (!this.isFullScreen('web')) {
                    // this.player.template.controller.classList.remove('dplayer-controller-comment-fullscreen');
                    // if (this.player.template.isShowBottomArea) {
                    // this.player.bottomArea.toggle();
                    //     this.player.comment.hideInner();
                    //     this.player.danmaku.hideInnerDanBox();
                    // }
                }
            }
        };
        const docfullscreenchange = () => {
            // 文档触发全屏改变事件
            const fullEle = document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            if (fullEle && fullEle !== this.player.container) {
                return;
            }
            this.player.resize();
            if (fullEle) {
                this.player.events.trigger('fullscreen');
                // this.player.comment.showInner();
            } else {
                utils.setScrollPosition(this.lastScrollPosition);
                this.player.events.trigger('fullscreen_cancel');
                // this.player.comment.hideInner();
                // 由全屏切换为网页全屏
                // if (!this.isFullScreen('web')) {
                //     this.player.template.controller.classList.remove('dplayer-controller-comment-fullscreen');
                // }
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

    isFullScreen(type = 'browser') {
        switch (type) {
            case 'browser':
                // bom 全屏接口 判断是否已经全屏
                return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            case 'web':
                return this.player.container.classList.contains('dplayer-fulled');
        }
    }

    // 全屏切换
    request(type = 'browser') {
        // 判断是否有已开启的其他全屏
        const anotherType = type === 'browser' ? 'web' : 'browser';
        const anotherTypeOn = this.isFullScreen(anotherType); // 是否有 web/browser全屏开启
        if (!anotherTypeOn) {
            this.lastScrollPosition = utils.getScrollPosition();
        }
        switch (type) {
            case 'browser':
                this.player.controller.hide();
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
                // this.player.bottomArea.hide();
                this.player.events.trigger('webfullscreen');
                break;
        }

        if (anotherTypeOn) {
            this.cancel(anotherType);
        }

        // this.player.template.controller.classList.add('dplayer-controller-comment-fullscreen');
    }

    cancel(type = 'browser') {
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
                // this.player.template.controller.classList.remove('dplayer-controller-comment-fullscreen');
                break;
        }
    }

    toggle(type = 'browser') {
        if (this.isFullScreen(type)) {
            // 是目标全屏状态 则取消全屏
            this.cancel(type);
        } else {
            // 非目标全屏状态 则执行全屏
            this.request(type);
        }
    }
}

export default FullScreen;
