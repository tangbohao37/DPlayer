class BottomArea {
    constructor(player) {
        this.player = player;
    }

    hide() {
        const dom = this.player.template.bottomAreaLeft.querySelector('.dplayer-showdan');
        this.player.template.bottomAreaLeft.querySelector('.show-dan-box').removeChild(dom);
        const target = this.player.template.controller.querySelector('.dplayer-icons-left .show-dan-box');
        target.insertBefore(dom, target.getElementsByTagName('div')[0]);
        this.player.template.bottomArea.style.display = 'none';
    }

    show() {
        const dom = this.player.template.controller.querySelector('.dplayer-showdan');
        this.player.template.controller.querySelector('.dplayer-icons-left .show-dan-box').removeChild(dom);
        const target = this.player.template.bottomArea.querySelector('.show-dan-box');
        target.insertBefore(dom, target.getElementsByTagName('div')[0]);
        this.player.template.bottomArea.style.display = 'flex';
    }

    toggle() {
        const b = this.player.container.classList.contains('dplayer-fulled');
        if (b) {
            this.hide();
        } else {
            this.show();
        }
    }
}

export default BottomArea;
