import '../css/base.less';
import '../css/config.css';
import $ from 'jquery';

$(document).ready(() => {
    // console.log('dom准备就绪');
    $('title').text('首页');
})

new Promise((resolve) => {
    setTimeout(() => {
        resolve('open');
    }, 1000);
}).then(res => {
    console.log(res);
});
// console.log('jquery', $);