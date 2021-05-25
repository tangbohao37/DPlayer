import { createDp, dpConfig } from './utils';

describe('配置UI渲染测试', () => {
    createDp();

    const videoEl = document.getElementsByTagName('video');

    test('video dom渲染', () => {
        expect(videoEl).toHaveLength(1);
    });

    test('video preload 属性设置', () => {
        expect(videoEl[0].getAttribute('preload')).toEqual(dpConfig.preload);
    });

    test('screenshot UI render', () => {
        const el = document.getElementsByClassName('dplayer-camera-icon');
        expect(el).toHaveLength(1);
    });

    test('top area UI render', () => {
        const el = document.getElementsByClassName('dplayer-top');
        expect(el[0].innerHTML).not.toBeUndefined();
    });

    test('live UI render', () => {
        const el = document.getElementsByClassName('dplayer-live-badge');
        if (dpConfig.live) {
            const speed = document.getElementsByClassName('dplayer-speed');
            const bar = document.querySelector('dplayer-bar-wrap');
            expect(speed).toHaveLength(0);
            expect(el).toHaveLength(1);
            expect(bar.style.display).toBe('none');
        } else {
            expect(el).toHaveLength(0);
        }
    });
});
