class Subtitle {
    constructor(container, video, options, events) {
        this.container = container;
        this.video = video;
        this.options = options;
        this.events = events;

        this.init();
    }

    init() {
        // 初始化字幕 父节点样式
        this.container.style.fontSize = this.options.fontSize;
        this.container.style.bottom = this.options.bottom;
        this.container.style.color = this.options.color;

        if (this.video.textTracks && this.video.textTracks[0]) {
            const track = this.video.textTracks[0];
            // 当 TextTrack 变化时
            track.oncuechange = () => {
                const cue = track.activeCues[0];
                this.container.innerHTML = '';
                if (cue) {
                    const template = document.createElement('div');
                    template.appendChild(cue.getCueAsHTML());
                    // 根据换行重新替换标签
                    const trackHtml = template.innerHTML
                        .split(/\r?\n/)
                        .map((item) => `<p>${item}</p>`)
                        .join('');
                    this.container.innerHTML = trackHtml;
                }
                this.events.trigger('subtitle_change');
            };
        }
    }

    show() {
        this.container.classList.remove('dplayer-subtitle-hide');
        this.events.trigger('subtitle_show');
    }

    hide() {
        this.container.classList.add('dplayer-subtitle-hide');
        this.events.trigger('subtitle_hide');
    }

    toggle() {
        if (this.container.classList.contains('dplayer-subtitle-hide')) {
            this.show();
        } else {
            this.hide();
        }
    }
}

export default Subtitle;
