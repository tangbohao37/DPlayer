class FlvListener {
    constructor(flvPlayer, player) {
        this.flvPlayer = flvPlayer;
        this.player = player;
        if (!window.flvjs) {
            this.notice("Error: Can't find flvjs.");
            return;
        }
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
                // 初始化正常，正在拉流
                status = 'sourceOpened';
            }
            if (str.includes('onSourceClose')) {
                // 服务器关闭流
                status = 'sourceClose';
            }
            if (str.includes('onSourceEnded')) {
                // C端停止推流/断流
                status = 'sourceEnd';
            }
            status && this.player.events.trigger('on_sources_tatus_change', status);
        });
    }
}

export default FlvListener;
