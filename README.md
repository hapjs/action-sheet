# ActionSheet

示例

```js 
// 引入
import ActionSheet from './action-sheet.js';

// 创建实例
var as = new ActionSheet({
    buttons: {
        '用户协议': function(e){
            console.info(e);
        },
    }
});

// 显示
as.show();

// 1秒后隐藏
setTimeout(function(){
    as.hide();
}, 1000);

// 2秒后更新按钮，并显示
setTimeout(function(){
    as.update({
        '用户协议': function(e){
            console.info(e);
        },
        '百度': 'http://baidu.com',
    }).show();
}, 2000);

```