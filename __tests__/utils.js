import DPlayer from '../dist/DPlayer';

const top = "<div id='test' style='display: flex;flex: 1;font-size:40px; color:#fff' onclick='fun()'>这里是顶部区域</div>";

export const dpConfig = {
    preload: 'none',
    screenshot: true,
    top: top,
    live: false,
    onStreamErrorInterval: true,
    onStreamEndInterval: true,
    timeout: 2000,
    video: {
        quality: [
            {
                name: 'HD',
                // url: 'https://tactivity-play.wiiqq.com/live/tactivity-push_20d396a52a0a4ba281050d29043abd67_customhd.flv?txSecret=643c60bd30973ce95daec581b7da256e&txTime=60A644E2',
                url: 'https://tactivity-play.wiiqq.com/live/tactivity-push_47dc616ae95b478eb71ac4d40124e82e_customhd.m3u8?txSecret=b3a002b90813036e4f2e7a768ef356a6&txTime=60A7151A',
                type: 'hls',
            },
            {
                name: 'SD',
                url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
                type: 'normal',
            },
        ],
        defaultQuality: 0,
        pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
    },
};

export const createDp = (config = {}) => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    return new DPlayer({ ...dpConfig, container: dom, ...config });
};
