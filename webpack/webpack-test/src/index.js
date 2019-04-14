import _ from 'lodash';
import './style.css';
// import Icon from './icon.png';
import printMe from './print.js';

function component() {
    let element = document.createElement('div');
    let btn = document.createElement('button');
  
    // lodash（目前通过一个 script 引入）对于执行这一行是必需的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    // 将图像添加到已存在的div中
    // var myIcon = new Image();
    // myIcon.src = Icon;
    // element.appendChild(myIcon);
  
    btn.innerHTML = '点击这路，然后查看console';
    btn.onclick = printMe;
    element.appendChild(btn);

    return element;
  }
  
  document.body.appendChild(component());