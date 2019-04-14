export default class audioPlugin {
    constructor(id, params) {
        const __defaultParams = {
            url: '',
            loop: false,
            name: '',
            source: ''
        };

        this.params = Object.assign(__defaultParams, params);
        this.init(id).bind(this);
        // this.bindEvent(); //事件绑定
    }
    init(id) {
        this.getDom(id);
    }
    getDom(id) {
        const _html = `<div class="audio-wrapper"><div class="audio-icon-wrap"><div class="audio-icon"></div></div><div class="audio-content">
        <div class="content-wrap"><p class="audio-name">${this.params.name}</p><p class="audio-source">${this.params.source}</p>
        <div class="audio-progress"><p class="progress-all"><span class="progress-current"></span></p><p class="progress-dot"></p></div>
        <div class="audio-time"><span class="time-current">00:00</span><span class="time-duration">00:00</span></div></div></div></div>`;

        // 下面是插件的内部参数
        this.dom = document.querySelector(id);
        this.dom.innerHTML = _html;
        // // 点击进行播放的图标
        this.audioIcon = this.dom.querySelector('.audio-wrapper .audio-icon');
        // 音频元素
        this.audio = this.dom.querySelector('.audio-wrapper .audio');
        // 音频的当前播放时间
        this.currentTime = this.dom.querySelector('.audio-wrapper .time-current');
        // 音频的总时间
        this.durationTime = this.dom.querySelector('.audio-wrapper .time-duration');
        // 进度条
        this.progressCurrent = this.dom.querySelector('.audio-wrapper .progress-current');
        // 总时间轴
        this.progressAll = this.progressCurrent.parentNode;
        // 进度条圆点
        this.progressDot = this.progressAll.nextElementSibling;
        // 总时间轴的长度
        this.progressAllWidth = this.progressAll.clientWidth;
        // 进度条圆点的大小
        this.progressDotWidth = this.progressDot.clientWidth;
        // 总时间轴的初始大小 - resize监听时使用
        this.progressInitWidth = this.progressAll.clientWidth;
    }
    createAudio() {
        const audioEle = document.createElement('audio');

        audioEle.src = this.params.url;
        audioEle.className = 'audio';
        // 设置循环播放
        audioEle.loop = this.params.loop;
        this.audioIcon.parentNode.appendChild(audioEle);
        // audioControl(); // 音频创建成功后对audio进行相关的事件监听
    }
}
