/**
 * 判断某个元素是否为空
 * @param  {空}  value
 * @return {Boolean}
 */
function isEmpty(obj) {
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
function isMobile() {
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
function setTimeFormat(time) {
    let minutes = parseInt(time / 60); // 转换成分钟

    if (minutes < 10) minutes = '0' + minutes;
    let seconds = Math.round(time % 60); // 提取秒数

    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds;
}
