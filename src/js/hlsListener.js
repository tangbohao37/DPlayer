import utils from './utils';

class HlsListener {
    constructor(hlsPlayer, player, videoSrc) {
        this.hlsPlayer = hlsPlayer;
        this.player = player;
        this.onStreamErrorInterval = player.onStreamErrorInterval; // 如果目标流获取失败是否轮训
        this.onStreamEndInterval = player.onStreamEndInterval; // 如果目标流中断是否轮询
        if (!window.Hls) {
            this.notice("Error: Can't find hls.js.");
            return;
        }
        this.intervalTimeOut = this.player.timeout;
        this.videoSrc = videoSrc;
        this.hlsjs = window.Hls;
        this.isIntervaling = false;
        this.networkErrorList = [
            // 网络连接超时
            this.hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT,
            // 网络中断未获取到索引
            this.hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR,
            // 获取到索引 但未能拉取到数据
            this.hlsjs.ErrorDetails.MANIFEST_PARSING_ERROR,
            // 网络错误导致 数据片加载失败
            this.hlsjs.ErrorDetails.FRAG_LOAD_ERROR,
            // 网络错误 数据片获取超时
            this.hlsjs.ErrorDetails.FRAG_LOAD_TIMEOUT,
        ];
        this.mediaErrorList = [
            // 媒体质量和code冲突
            this.hlsjs.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
            // 媒体解码错误
            this.hlsjs.ErrorDetails.FRAG_DECRYPT_ERROR,
            // 媒体序列化错误
            this.hlsjs.ErrorDetails.FRAG_PARSING_ERROR,
            // 加入新片段错误 （断流重开场景）
            this.hlsjs.ErrorDetails.BUFFER_ADD_CODEC_ERROR,
            // 索引的片段无法加载
            this.hlsjs.ErrorDetails.BUFFER_INCOMPATIBLE_CODECS_ERROR,
            // 在调用缓冲区附加时 引发异常
            this.hlsjs.ErrorDetails.BUFFER_APPEND_ERROR,
        ];
        this.endStream = [
            // 片段获取失败
            this.hlsjs.ErrorDetails.LEVEL_LOAD_ERROR,
            // 网络连接超时
            this.hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT,
        ];
    }

    initEventListener() {
        // Object.keys(this.hlsjs.Events).forEach((e) => {
        //     this.hlsPlayer.on(this.hlsjs.Events[e], console.info.bind(console));
        // });
        // 数据获取成功
        this.hlsPlayer.once(this.hlsjs.Events.LEVEL_LOADED, (event, data) => {
            this.player.events.trigger('connected', event, data);
        });
        // 网络或视频错误
        this.hlsPlayer.on(this.hlsjs.Events.ERROR, (event, data) => {
            console.log('hls事件：', event, data);
            // '网络错误'
            if (this.networkErrorList.includes(data.details)) {
                console.log('网络错误');
                // 停止拉取碎片
                this.hlsPlayer.stopLoad();
                this.player.events.trigger('disconnect');
                if (this.onStreamEndInterval && !this.isIntervaling) {
                    // 开始轮询
                    this.intervalSourceStream();
                }
            }
            // 媒体错误
            if (this.mediaErrorList.includes(data.details)) {
                const e = this.hlsPlayer.recoverMediaError();
                console.log('媒体错误', e);
            }
            // 中途断流事件
            if (this.endStream.includes(data.details)) {
                console.log('中途断流');
                this.hlsPlayer.stopLoad();
                this.player.events.trigger('disconnect');
                if (this.onStreamEndInterval && !this.isIntervaling) {
                    this.intervalSourceStream();
                }
            }
        });
    }
    offEventListener() {
        Object.keys(this.hlsjs.Events).forEach((e) => {
            this.hlsPlayer.off(this.hlsjs.Events[e]);
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
                if (this.hlsPlayer) {
                    // 销毁实例
                    this.offEventListener();
                    this.hlsPlayer.detachMedia();
                    this.hlsPlayer.destroy();
                    // 重新创建实例
                    this.player.createHlsInstance(src, this.player.template.video);
                }
                this.player.events.trigger('reconnect');
            });
        }, this.intervalTimeOut);
    }
}

export default HlsListener;
