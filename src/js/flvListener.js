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
        this.initEventListener();
    }
    initEventListener() {
        // 网络或视频错误
        this.flvPlayer.on(this.flvjs.Events.ERROR, (type, detail, code) => {
            if (this.onStreamErrorInterval) {
                // 流拉取失败 需要轮训重新拉取
                this.intervalSourceStream();
            }
            this.player.events.trigger('error', { type, detail, resCode: code });
        });
        // 拉取流信息
        this.flvPlayer.on(this.flvjs.Events.MEDIA_INFO, (...e) => {
            this.player.events.trigger('loadeddata', e);
        });
        // 成功拉取数据元信息/成功拉到流
        this.flvPlayer.on(this.flvjs.Events.METADATA_ARRIVED, (...e) => {
            console.log('成功拉取数据元信息', e);
            this.player.events.trigger('on_connected', e);
        });
        // 网络异常，已重新连接
        this.flvPlayer.on(this.flvjs.Events.RECOVERED_EARLY_EOF, (...e) => {
            this.player.events.trigger('on_reconnect', e);
        });
        // 断流/加载完成
        this.flvPlayer.on(this.flvjs.Events.LOADING_COMPLETE, (...e) => {
            this.player.events.trigger('canplaythrough', e);
        });
        // 断流事件
        this.flvjs.LoggingControl.addLogListener((type, str) => {
            let status = '';
            if (str.includes('onSourceOpen')) {
                // 初始化正常，正在尝试拉流
                status = 'sourceOpened';
            }
            if (str.includes('onSourceClose')) {
                // 服务器关闭流
                status = 'sourceClose';
            }
            if (str.includes('onSourceEnded')) {
                // C端停止推流/断流
                status = 'sourceEnd';
                if (this.onStreamEndInterval) {
                    // 流拉取失败 需要轮训重新拉取
                    this.intervalSourceStream();
                }
            }
            // 网络流状态改变事件
            status && this.player.events.trigger('on_sources_tatus_change', status);
        });
    }
    intervalSourceStream() {
        const url = this.videoSrc;
        const intervalCheck = setInterval(() => {
            utils.checkStream(url).then(() => {
                // 请求连通
                clearInterval(intervalCheck);
                if (this.flvPlayer) {
                    // 连接成功 重新创建实例
                    this.flvPlayer.pause();
                    this.flvPlayer.unload();
                    this.flvPlayer.detachMediaElement();
                    this.flvPlayer.destroy();
                    this.flvPlayer = null;
                    this.flvPlayer = window.flvjs.createPlayer({ type: 'flv', url: url, isLive: this.player.options.live }, this.player.options.pluginOptions.flv.config);
                    this.flvPlayer.attachMediaElement(this.player.template.video);
                    this.flvPlayer.load();
                    this.flvPlayer.play();
                }
            });
        }, this.intervalTimeOut);
    }
}

export default FlvListener;
