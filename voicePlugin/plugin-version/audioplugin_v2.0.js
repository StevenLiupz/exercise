import 'css/audio.css';
export default class AudioPlugin {
    // 设置实例属性
    startX = 0; // 记录 移动开始时的坐标 & 要移动的距离 & 移动结束后的坐标
    moveX = 0;
    endX = 0;
    status = true; // 状态管理器 - 控制拖动过程中 音频播放更新事件 时时间不做任何操作
    flag = false; // 状态管理器 - 控制鼠标按下时才能执行mousemove的相关操作
    constructor(id, params) {
        const __defaultParams = {
            url: '',
            loop: false,
            name: '',
            source: ''
        };

        this.params = Object.assign(__defaultParams, params);
        this.movestart = this.movestart.bind(this);
        this.moving = this.moving.bind(this);
        this.moveend = this.moveend.bind(this);
        this.init(id);
    }
    init(id) {
        this.eventType = this.isMobile(); // 用于存储是执行移动端事件还是PC端事件
        console.log('设备', this.eventType);
        this.getDom(id);
    }
    getDom(id) {
        let _html = `<div class="audio-wrapper"><div class="audio-icon-wrap"><div class="audio-icon"></div></div>
        <div class="audio-content"><div class="content-wrap">`;

        if (!this.isEmpty(this.params.name)) {
            _html += `<p class="audio-name">${this.params.name}</p>`;
        }
        if (!this.isEmpty(this.params.source)) {
            _html += `<p class="audio-source">${this.params.source}</p>`;
        }
        _html += `<div class="audio-progress"><p class="progress-all"><span class="progress-current"></span></p>
        <p class="progress-dot"></p></div><div class="audio-time"><span class="time-current">00:00</span>
        <span class="time-duration">00:00</span></div></div></div></div>`;

        // 下面是插件的内部参数
        this.dom = document.querySelector(id);
        this.dom.innerHTML = _html;
        // 点击进行播放的图标
        this.audioIcon = this.dom.querySelector('.audio-wrapper .audio-icon');
        // 音频元素
        this.audio = this.dom.querySelector('.audio-wrapper .audio');
        // 音频的当前播放时间
        this.currentTimeText = this.dom.querySelector('.audio-wrapper .time-current');
        // 音频的总时间
        this.durationTimeText = this.dom.querySelector('.audio-wrapper .time-duration');
        // 进度条
        this.progressCurrent = this.dom.querySelector('.audio-wrapper .progress-current');
        // 总时间轴
        this.progress = this.dom.querySelector('.audio-wrapper .audio-progress');
        // 进度条圆点
        this.progressDot = this.progress.querySelector('.progress-dot');
        // 总时间轴的长度
        this.progressAllWidth = this.progress.clientWidth;
        // 总时间轴的初始大小 - resize监听时使用
        this.progressInitWidth = this.progress.clientWidth;
        // 时间轴在页面中距离页面左侧的距离
        this.progressLeft = this.progress.getBoundingClientRect().left;
        // 进度条圆点的大小
        this.progressDotWidth = this.progressDot.clientWidth;
        this.createAudio();
    }

    /**
     * 判断某个元素是否为空
     * @param  {空}  value
     * @return {Boolean}
     */
    isEmpty(obj) {
        if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
            return true;
        }
        if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
            return true;
        }
        if (obj === '' || obj === ' ' || obj === '[]' || obj === '{}' || obj === undefined) {
            return true;
        }
        return false;
    }

    /**
     * 获取设备类型 - 移动端还是PC端
     * @returns boolean true表示是移动端，false表示是PC端
     */
    isMobile() {
        const __ua = window.navigator.userAgent.toLowerCase();

        if (/mobile/i.test(__ua)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 设置音频时间 - 时间格式转换(不考虑超过小时的情况)
     * @param {*} time
     * @returns The time of format such as '00:00'
     */
    setTimeFormat(time) {
        let minutes = parseInt(time / 60); // 转换成分钟

        if (minutes < 10) minutes = '0' + minutes;
        let seconds = Math.round(time % 60); // 提取秒数

        if (seconds < 10) seconds = '0' + seconds;

        return minutes + ':' + seconds;
    }

    /**
     * 移除事件绑定
     * @param obj
     */
    removeEvents() {
        if (this.eventType) {
            document.removeEventListener('touchmove', this.moving, {passive: false});
            document.removeEventListener('touchend', this.moveend, false);
        } else {
            document.removeEventListener('mousemove', this.moving, {passive: false});
            document.removeEventListener('mouseup', this.moveend, false);
        }
    }

    /**
     * 添加事件监听
     * @param obj
     */
    addEvents() {
        // mousemove 事件必须绑定在 document 上，因为鼠标移动是在全屏上移动的
        if (this.eventType) {
            document.addEventListener('touchmove', this.moving, {passive: false});
            document.addEventListener('touchend', this.moveend, false);
        } else {
            document.addEventListener('mousemove', this.moving, {passive: false});
            document.addEventListener('mouseup', this.moveend, false);
        }
    }
    // 设置音频的播放进度及当前播放时间
    progressMove(progressWidth) {
        const progressLeft = (progressWidth - this.progressDotWidth) > 0 ? progressWidth - this.progressDotWidth : 0;
        const currentTime = progressWidth / this.progressAllWidth * this.durationTime;

        this.progressCurrent.style.width = progressWidth + 'px';
        this.progressDot.style.left = progressLeft + 'px';
        this.currentTimeText.innerText = this.setTimeFormat(currentTime);
    }
    // 音频的播放与暂停
    audioClicks() {
        this.audioIcon.addEventListener('click', ()=> {
            console.log('点击播放暂停');
            // 判断音频是否处于暂停状态 - 这里通过音频的状态来判断，也可以通过页面元素是否有play样式来判断
            if (this.audio.paused) {
                this.audio.play(); // 播放音频
            } else {
                this.audio.pause(); // 暂停音频
            }
        });
    }
    // 创建音频
    createAudio() {
        const audioEle = document.createElement('audio');

        audioEle.src = this.params.url;
        audioEle.className = 'audio';
        // 设置循环播放
        audioEle.loop = this.params.loop;
        this.audioIcon.parentNode.appendChild(audioEle);
        this.audio = this.dom.querySelector('.audio');
        console.log('音频创建成功');
        this.audioControl(); // 音频创建成功后对audio进行相关的事件监听
    }
    // 音频事件监听
    audioControl() {
        // 监听 视频/音频 的加载，加载完成时触发
        this.audio.addEventListener('loadstart', ()=> {
            console.log('loadstart');
        }, false);
        this.audio.addEventListener('loadedmetadata', ()=> {
            console.log('loadedmetadata');
            this.durationTime = this.audio.duration; // 设置音频文件的总时间

            this.durationTimeText.innerText = this.setTimeFormat(this.durationTime); // 设置音频总时间
            // 音频加载完成后即可播放音频
            this.audioClicks();
            this.bindEvent(); // 事件绑定
        }, false);
        this.audio.addEventListener('loadeddata', ()=> { // ios下只有在用户主动交互（如：click）时才能进行播放，播放后才能触发loadeddata事件
            console.log('loadeddata');
            // this.durationTime = this.audio.duration; // 设置音频文件的总时间

            // this.durationTimeText.innerText = this.setTimeFormat(this.durationTime); // 设置音频总时间
            // // 音频加载完成后即可播放音频
            // this.audioClicks();
            // this.bindEvent(); // 事件绑定
        }, false);
        // 监听音频的播放事件 - 音频开始播放后触发
        this.audio.addEventListener('play', ()=> {
            this.audioIcon.classList.add('play');
        });
        // 监听音频的暂停事件 - 音频暂停后触发
        this.audio.addEventListener('pause', ()=> {
            this.audioIcon.classList.remove('play');
        });
        // 监听音频的播放位置改变事件 - 音频在播放过程中会一直触发
        this.audio.addEventListener('timeupdate', ()=> {
            const _currentTime = this.audio.currentTime;
            const _progress = _currentTime / this.durationTime; // 播放进度
            const _width = _progress * this.progressAllWidth;
            // 设置进度条圆点 - 进度条设置了圆角样式，这里对进度条圆点设置要减掉圆点的宽否则会圆点和线会有间隙
            const _left = _progress * (this.progressAllWidth - this.progressDotWidth);

            if (this.status) this.progressMove(_width, _left, _currentTime); // 设置播放进度
            if (parseInt(_currentTime) >= parseInt(this.durationTime)) {
                // 播放结束后重置相关的参数
                setTimeout(()=> {
                    this.endX = 0;
                    this.progressMove(0);
                }, 500);
            }
        });
    }
    movestart(e) {
        e.preventDefault();
        e.stopPropagation();

        this.flag = true; // 可以执行mousemove的事件操作了
        if (!this.isEmpty(e.touches)) {
            if (e.touches.length > 1) return;
            this.startX = parseInt(e.touches[0].pageX) - this.progressLeft; // 记录手指触摸时的初始位置
        } else {
            if (e.button === 0) this.startX = parseInt(e.pageX) - this.progressLeft; // 记录手指触摸时的初始位置
        }
        this.addEvents();
        return false;
    }
    moving(e) {
        e.preventDefault();
        e.stopPropagation();

        const pageX = this.isEmpty(e.touches) ? e.pageX : e.touches[0].pageX;

        if (this.status) {
            this.status = false; // 禁止在播放过程中,播放时间更新事件监听函数中设置进度条和时间
            this.progressMove(this.startX);
        }
        if (this.flag) { // 判断是否可以进行move事件
            this.moveX = parseInt(pageX) - this.progressLeft; // 记录移动的距离
            // 控制不让进度条拖出时间轴区域
            if (this.moveX <= 0) {
                this.progressMove(0);
                return false;
            }
            if (this.moveX >= this.progressAllWidth) {
                this.progressMove(this.progressAllWidth);
                return false;
            }
            this.progressMove(this.moveX); // 时间和进度条更新
        }
    }
    moveend(e) {
        e.preventDefault();
        e.stopPropagation();
        const _pageX = this.isEmpty(e.changedTouches) ? e.pageX : e.changedTouches[0].pageX;

        this.flag = false;
        this.status = true;
        this.endX = _pageX - this.progressLeft; // 记录手指离开时滚动条的长度(播放进度)
        this.progressMove(this.endX);
        const currentTime = parseInt(this.endX / this.progressAllWidth * this.durationTime); // 求当前时间

        this.audio.currentTime = currentTime;
        // 控制非循环状态下播放完成后进行拖动继续播放
        if (this.audio.paused) this.audio.play();
        this.removeEvents(); // 移除手指滑动和手指离开事件监听
        return false;
    }
    bindEvent() {
        // 进度条拖放事件
        if (this.eventType) {
            this.progress.addEventListener('touchstart', this.movestart, false);
        } else {
            this.progress.addEventListener('mousedown', this.movestart, false);
        }
    }
}
