import utils from './utils';

class HlsListener {
    constructor(hlsPlayer, player, videoSrc) {
        this.hlsPlayer = hlsPlayer;
        this.player = player;
        this.onStreamErrorInterval = player.onStreamErrorInterval;
        this.onStreamEndInterval = player.onStreamEndInterval;
        if (!window.Hls) {
            this.notice("Error: Can't find hls.js.");
            return;
        }
        this.intervalTimeOut = this.player.timeout;
        this.videoSrc = videoSrc;
        this.hlsjs = window.Hls;
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
        this.initEventListener();
    }

    initEventListener() {
        // 网络或视频错误
        this.hlsPlayer.on(this.hlsjs.Events.ERROR, (event, data) => {
            console.log('触发事件：', event, data);
            if (this.networkErrorList.includes(data.details)) {
                console.log('网络错误');
                this.hlsPlayer.stopLoad();
                this.intervalSourceStream();
                this.player.events.trigger('error', { type: data.type, details: data.details });
            }
            // 媒体错误
            if (this.mediaErrorList.includes(data.details)) {
                console.log('媒体错误');
                this.hlsPlayer.recoverMediaError();
            }
            // 中途断流事件
            if (this.endStream.includes(data.details)) {
                console.log('中途断流');
                this.player.events.trigger('on_sources_tatus_change', 'sourceEnd');
            }
        });
    }
    intervalSourceStream() {
        const url = this.videoSrc;
        const intervalCheck = setInterval(() => {
            utils.checkStream(url).then(() => {
                console.log('开始轮询');
                // 请求连通
                clearInterval(intervalCheck);
                if (this.hlsPlayer) {
                    // 连接成功 重新连接
                    this.hlsPlayer.loadSource(this.videoSrc);
                    this.hlsPlayer.startLoad();
                    this.player.play();
                }
            });
        }, this.intervalTimeOut);
    }
}

export default HlsListener;
