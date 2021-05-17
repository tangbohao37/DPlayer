// import Icons from './icons';
import utils from './utils';
// import tplComment from '../template/controller/comment.art';

class Comment {
    constructor(player) {
        this.player = player;
        this.initComment('bottom');
        this.bind();
        this.initListener();
    }

    // initComment(type = null) {
    //     const commentDom = tplComment({
    //         icons: Icons,
    //         tran: this.player.tran,
    //     });
    // this.commentEle = new DOMParser().parseFromString(commentDom, 'text/html').body.firstChild;
    // if (type === 'inner') {
    //     this.commentInnerBox.insertBefore(this.commentEle, this.commentInnerBox.getElementsByTagName('div')[0]);
    // }
    // if (type === 'bottom') {
    //     this.player.template.bottomAreaRight.insertBefore(this.commentEle, this.player.template.bottomAreaRight.getElementsByTagName('div')[0]);
    // }
    // }

    initListener() {
        // this.player.template.mask.addEventListener('click', () => {
        //     this.hide();
        // });
        this.commentSettingButton.addEventListener('click', () => {
            this.toggleSetting();
        });

        this.commentColorSettingBox.addEventListener('click', () => {
            const sele = this.commentColorSettingBox.querySelector('input:checked+span');
            if (sele) {
                const color = this.commentColorSettingBox.querySelector('input:checked').value;
                // this.commentSettingFill.style.fill = color;
                this.commentInput.style.color = color;
                // this.commentSendFill.style.fill = color;
            }
        });

        this.commentInput.addEventListener('click', () => {
            this.hideSetting();
        });
        this.commentInput.addEventListener('keydown', (e) => {
            const event = e || window.event;
            if (event.keyCode === 13) {
                this.send();
            }
        });

        this.commentSendButton.addEventListener('click', () => {
            this.send();
            this.hide();
        });
    }

    show() {
        this.player.controller.disableAutoHide = true;
        this.player.template.controller.classList.add('dplayer-controller-comment');
        this.player.template.mask.classList.add('dplayer-mask-show');
        this.player.container.classList.add('dplayer-show-controller');
        this.commentInput.focus();
    }

    // showInner() {
    //     // 删除底部区域dom
    //     const dom = this.player.template.bottomAreaRight.querySelector('.dplayer-comment-box');
    //     if (this.player.template.bottomAreaRight.contains(dom)) {
    //         this.player.template.bottomAreaRight.removeChild(dom);
    //     }
    //     this.commentInnerBox.insertBefore(this.commentEle, this.commentInnerBox.getElementsByTagName('div')[0]);
    // }

    // hideInner() {
    //     const dom = this.commentInnerBox.querySelector('.dplayer-comment-box');
    //     if (this.commentInnerBox.contains(dom)) {
    //         this.commentInnerBox.removeChild(dom);
    //     }
    //     this.player.template.bottomAreaRight.insertBefore(this.commentEle, this.player.template.bottomAreaRight.getElementsByTagName('div')[0]);
    // }

    hide() {
        this.player.template.controller.classList.remove('dplayer-controller-comment');
        this.player.template.mask.classList.remove('dplayer-mask-show');
        this.player.container.classList.remove('dplayer-show-controller');
        this.player.controller.disableAutoHide = false;
        this.hideSetting();
    }

    showSetting() {
        this.commentSettingBox.classList.add('dplayer-comment-setting-open');
    }

    hideSetting() {
        this.commentSettingBox.classList.remove('dplayer-comment-setting-open');
    }

    bind() {
        this.commentInnerBox = this.player.container.querySelector('.dplayer-inner-comment-box');
        this.commentInput = this.player.container.querySelector('.dplayer-comment-input');
        this.commentSettingBox = this.player.container.querySelector('.dplayer-comment-setting-box'); // 弹幕颜色选择按钮
        this.commentSettingButton = this.player.container.querySelector('.dplayer-comment-setting-icon');
        this.commentSettingFill = this.player.container.querySelector('.dplayer-comment-setting-icon path');
        this.commentSendButton = this.player.container.querySelector('.dplayer-send-icon'); // 发送按钮
        this.commentSendFill = this.player.container.querySelector('.dplayer-send-icon path');
        this.commentColorSettingBox = this.player.container.querySelector('.dplayer-comment-setting-color');
    }

    toggleSetting() {
        if (this.commentSettingBox.classList.contains('dplayer-comment-setting-open')) {
            this.hideSetting();
        } else {
            this.showSetting();
        }
    }

    send() {
        this.commentInput.blur();

        // text can't be empty
        if (!this.commentInput.value.replace(/^\s+|\s+$/g, '')) {
            this.player.notice(this.player.tran('Please input danmaku content!'));
            return;
        }

        this.player.danmaku.send(
            {
                text: this.commentInput.value,
                color: utils.color2Number(this.player.container.querySelector('.dplayer-comment-setting-color input:checked').value),
                type: parseInt(this.player.container.querySelector('.dplayer-comment-setting-type input:checked').value),
            },
            () => {
                this.commentInput.value = '';
                this.hide();
            }
        );
    }
}

export default Comment;
