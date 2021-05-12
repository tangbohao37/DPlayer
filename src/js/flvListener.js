import utils from './utils';
class FlvListener {
    constructor(flvPlayer, player, videoSrc) {
        this.flvPlayer = flvPlayer;
        this.player = player;
        this.onStreamErrorInterval = player.onStreamErrorInterval;
        this.onStreamEndInterval = player.onStreamEndInterval;
        if (!window.flvjs) {
            this.notice("Error: Can't find flvjs.");
            return;
        }
        this.intervalTimeOut = this.player.timeout;
        this.videoSrc = videoSrc;
        this.isIntervaling = false;
        this.flvjs = window.flvjs;
        this.flvjs.LoggingControl.enableVerbose = false;
        this.flvjs.LoggingControl.forceGlobalTag = false;
        this.flvjs.LoggingControl.globalTag = false;
        this.flvjs.LoggingControl.enableAll = false;
        this.flvjs.LoggingControl.enableDebug = false;
        this.flvjs.LoggingControl.enableVerbose = false;
        this.flvjs.LoggingControl.enableInfo = false;
        this.flvjs.LoggingControl.enableWarn = false;
        this.flvjs.LoggingControl.enableError = false;
    }
    initEventListener() {
        // 网络或视频错误
        this.flvPlayer.on(this.flvjs.Events.ERROR, (type, detail, response) => {
            // 网络异常 未拉取到数据
            console.log('网络或视频错误', type, detail, response);
            if (type === this.flvjs.ErrorTypes.MEDIA_ERROR && response.code === '404') {
                this.player.events.trigger('disconnect');
                if (this.onStreamErrorInterval && !this.isIntervaling) {
                    // 流拉取失败 需要轮训重新拉取
                    this.intervalSourceStream();
                }
            }
        });
        // 拉取流信息
        this.flvPlayer.on(this.flvjs.Events.MEDIA_INFO, (...e) => {
            console.log('拉取流信息', e);
            // this.player.events.trigger('loadeddata', e);
        });
        // 成功拉取数据元信息/成功拉到流
        this.flvPlayer.on(this.flvjs.Events.METADATA_ARRIVED, (...e) => {
            console.log('成功拉取数据元信息', e);
            this.player.events.trigger('connected', e);
        });
        // 网络异常，已重新连接
        this.flvPlayer.on(this.flvjs.Events.RECOVERED_EARLY_EOF, (...e) => {
            console.log('网络异常，已重新连接', e);
            this.player.events.trigger('reconnect', e);
        });
        // 断流/加载完成
        this.flvPlayer.on(this.flvjs.Events.LOADING_COMPLETE, (...e) => {
            console.log('断流/加载完成', e);
            // this.player.events.trigger('canplaythrough', e);
        });
        // log 监听
        this.flvjs.LoggingControl.addLogListener((type, str) => {
            if (str.includes('onSourceOpen')) {
                // 初始化正常，正在尝试拉流
                console.log('flv初始化正常，正在尝试拉流');
            }
            if (str.includes('onSourceClose')) {
                // 服务器关闭流
                console.log('服务器关闭流');
            }
            if (str.includes('onSourceEnded')) {
                // C端停止推流/断流
                console.log('C端停止推流/断流');
                if (this.onStreamEndInterval && !this.isIntervaling) {
                    // 流拉取失败 需要轮训重新拉取
                    this.intervalSourceStream();
                }
            }
        });
    }
    offEventListener() {
        Object.keys(this.flvjs.Events).forEach((e) => {
            this.hlsPlayer.off(this.flvjs.Events[e]);
        });
    }
    intervalSourceStream() {
        const src = this.videoSrc;
        this.isIntervaling = true;
        const intervalCheck = setInterval(() => {
            utils.checkStream(src).then(() => {
                // 请求连通
                clearInterval(intervalCheck);
                this.isIntervaling = false;
                if (this.flvPlayer) {
                    //  重新创建实例
                    this.offEventListener();
                    this.flvPlayer.detachMediaElement();
                    this.flvPlayer.destroy();
                    this.flvPlayer = null;
                    this.player.createFlvInstance(src, this.player.template.video);
                    // this.flvPlayer = window.flvjs.createPlayer({ type: 'flv', url: url, isLive: this.player.options.live }, this.player.options.pluginOptions.flv.config);
                }
                this.player.events.trigger('reconnect');
            });
        }, this.intervalTimeOut);
    }
}

export default FlvListener;
