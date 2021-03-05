class BottomArea {
    constructor(player) {
        this.player = player;
    }

    hide() {
        this.player.template.bottomArea.style.display = 'none';
    }

    show() {
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
