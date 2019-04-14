const oAudioBtn = document.getElementById('audio-btn'); // 点击进行播放的按钮
const oCurrentTime = document.getElementById('currentTime'); // 当前播放时间
const oProgress = document.getElementById('progress'); // 进度条
const oAllProgress = oProgress.parentNode; // 总时间轴
let oAllProgressWidth = oAllProgress.clientWidth; // 总时间轴的长度
const initialWidth = oAllProgress.clientWidth; // 记录最开始时的值，用于resize监听时使用
const oProgressDot = document.getElementById('progress-dot'); // 进度条圆点
const oProgressDotWidth = oProgressDot.clientWidth; // 进度条圆点的宽
let oAudio = ''; // 音频元素
let oAudioTime = 0; // 音频的总时长
let startX = 0, moveX = 0, endX = 0; // 记录 移动开始时的坐标 & 要移动的距离 & 移动结束后的坐标
let status = true; // 状态管理器 - 控制拖动过程中 音频播放更新事件 时时间不做任何操作
let flag = false; // 状态管理器 - 控制鼠标按下时才能执行mousemove的相关操作

/**
 * 音频的播放与暂停
 */
function audioClicks() {
    oAudioBtn.addEventListener('click', ()=> {
        // 判断音频是否处于暂停状态 - 这里通过音频的状态来判断，也可以通过页面元素是否有play样式来判断
        if (oAudio.paused) {
            oAudio.play(); // 播放音频
        } else {
            oAudio.pause(); // 暂停音频
        }
    });
}

/**
 * 设置音频的播放进度及当前播放时间
 */
function progressMove(width, left, time) {
    oProgress.style.width = width + 'px';
    oProgressDot.style.left = left + 'px';
    oCurrentTime.innerText = setTimeFormat(time);
}

/**
 * audio的事件监听
 */
function audioControl() {
    // 监听 视频/音频 的加载，加载完成时触发
    oAudio.addEventListener('loadeddata', ()=> {
        const oAllTime = document.getElementById('allTime'); // 音频总时间

        oAudioTime = oAudio.duration; // 获取音频文件的时长
        oAllTime.innerText = setTimeFormat(oAudioTime); // 设置时间
        // 音频加载完成后即可播放音频
        audioClicks();

        if (isMobile()) {
            oProgressDot.addEventListener('touchstart', moveEvents.touchstart, false); // 移动端的进度条拖放事件
        } else {
            oProgressDot.addEventListener('mousedown', mouseEvents.mousedown, false); // PC端的进度条拖放事件
        }
    });
    // 监听音频的播放事件 - 音频开始播放后触发
    oAudio.addEventListener('play', ()=> {
        oAudioBtn.classList.add('play');
    });
    // 监听音频的暂停事件 - 音频暂停后触发
    oAudio.addEventListener('pause', ()=> {
        oAudioBtn.classList.remove('play');
    });
    // 监听音频的播放位置改变事件 - 音频在播放过程中会一直触发
    oAudio.addEventListener('timeupdate', ()=> {
        console.log('事件更新');
        const _currentTime = oAudio.currentTime;
        const _progress = _currentTime / oAudioTime; // 播放进度
        const _width = _progress * oAllProgressWidth;
        // 设置进度条圆点 - 进度条设置了圆角样式，这里对进度条圆点设置要减掉圆点的宽否则会圆点和线会有间隙
        const _left = _progress * (oAllProgressWidth - oProgressDotWidth);

        if (status) progressMove(_width, _left, _currentTime); // 设置播放进度
        if (parseInt(_currentTime) >= parseInt(oAudioTime)) {
            // 播放结束后重置相关的参数
            setTimeout(()=> {
                endX = 0;
                progressMove(0, 0, 0);
            }, 500);
        }
    });
}

/**
 * 创建audio
 */
function getMusic() {
    const audioEle = document.createElement('audio');

    audioEle.src = '../images/music.m4a';
    audioEle.id = 'audio';
    audioEle.className = 'audio';
    // audioEle.loop = true; // 设置循环播放
    oAudioBtn.parentNode.appendChild(audioEle);
    oAudio = document.querySelector('audio');
    audioControl(); // 音频创建成功后对audio进行相关的事件监听
}

/**
 * 移除事件绑定
 * @param obj
 */
function removeEvents(obj) {
    for (const key in obj) {
        document.removeEventListener(key, obj[key], false);
    }
}

/**
 * 添加事件监听
 * @param obj
 */
function addEvents(obj) {
    for (const key in obj) {
        document.addEventListener(key, obj[key], false);
    }
}

getMusic(); // 创建音频

window.onresize = function() {
    // 时间轴长度与初始长度不一致时重置总时间的长度
    if (initialWidth != oAllProgress.clientWidth) oAllProgressWidth = oAllProgress.clientWidth;
    // console.log(oAllProgressWidth);
};

const eventHandlers = {
    move: function(e, pageX) {
        e.preventDefault();
        e.stopPropagation();
        status = false; // 禁止在播放过程中 播放时间更新事件 监听函数中设置进度条和时间
        if (flag) { // 判断是否可以进行move事件
            moveX = parseInt(pageX) - startX; // 记录移动的距离
            const progressWidth = endX + moveX;
            let progressLeft = progressWidth - oProgressDotWidth;
            const _currentTime = progressWidth / oAllProgressWidth * oAudioTime;

            // 控制非循环状态下播放完成后进行拖动继续播放
            if (!oAudio.loop && oAudio.paused) oAudio.play();
            // 控制不让进度条拖出时间轴区域
            if (progressWidth <= 0 && moveX <= 0) {
                progressMove(0, 0, 0);
                return false;
            }
            if (progressWidth >= oAllProgressWidth && moveX >= 0) {
                progressLeft = oAllProgressWidth - oProgressDotWidth;
                progressMove(oAllProgressWidth, progressLeft, oAudioTime);
                return false;
            }
            progressMove(progressWidth, progressLeft, _currentTime); // 时间和进度条更新
        }
    },
    end: function(e) {
        e.preventDefault();
        e.stopPropagation();
        status = true;
        flag = false;
        endX = isEmpty(oProgress.style.width) ? 0 : parseInt(oProgress.style.width.replace('px', '')); // 记录手指离开时滚动条的长度(播放进度)
        const currentTime = parseInt(endX / oAllProgressWidth * oAudioTime); // 求当前时间

        oAudio.currentTime = currentTime;
        return false;
    }
};

const moveEvents = {
    touchstart: function(e) {
        e.preventDefault();
        e.stopPropagation();
        // 如果是多指拖动则不做任何操作
        if (e.touches.length > 1) return;
        flag = true;
        startX = parseInt(e.touches[0].pageX); // 记录手指触摸时的初始位置

        // touchmove 事件必须绑定在 document 上，因为鼠标移动是可以在全屏上移动的
        addEvents(moveEvents);
        return false;
    },
    touchmove: function(e) {
        eventHandlers.move(e, e.touches[0].pageX);
        return false;
    },
    touchend: function(e) {
        eventHandlers.end(e);
        removeEvents(moveEvents); // 移除手指滑动和手指离开事件监听
        return false; // 阻止默认的事件冒泡
    }
};
const mouseEvents = {
    mousedown: function(e) {
        e.preventDefault();
        e.stopPropagation();
        // 判断是否是鼠标左键点击
        if (e.button == 0) {
            startX = parseInt(e.pageX); // 记录手指触摸时的初始位置
            flag = true; // 可以执行mousemove的事件操作了
            // mousemove 事件必须绑定在 document 上，因为鼠标移动是在全屏上移动的
            addEvents(mouseEvents);
        }
        return false; // 阻止默认的事件冒泡
    },
    mousemove: function(e) {
        eventHandlers.move(e, e.pageX);
        return false; // 阻止默认的事件冒泡
    },
    mouseup: function(e) {
        eventHandlers.end(e);
        removeEvents(mouseEvents); // 移除鼠标移动和鼠标松开事件监听
        return false; // 阻止默认的事件冒泡
    }
};



// 进度条的点击事件
oAllProgress.addEventListener('click', e=> {
    e.preventDefault();
    e.stopPropagation();

    // 获取元素在距离页面左部的left距离
    const eleLeft = parseInt(oProgress.getBoundingClientRect().left);

    endX = parseInt(e.pageX) - eleLeft; // 记录手指离开时的位置
    oProgress.style.width = endX + 'px';
    oProgressDot.style.left = endX + 'px';
    oAudio.currentTime = (endX / oAllProgressWidth) * oAudioTime;
    if (oAudio.paused) oAudio.play();
}, false);
