# pushbutton 移动端弹出列表选择框
移动端从下往上推动画效果端弹出列表选择框，适应所有主流移动端机型，支持Node引入，require引入;如有用得不爽可以随时提意见，谢谢。


demo地址: <a href="https://gtdalp.github.io/widget/pushbutton/test.html">https://gtdalp.github.io/widget/pushbutton/demos/pushbutton.html</a>

###npm安装
```javascript
npm install pushbuttonjs
```


## 使用方法如下：

###1、html结构
```html
<section id="pushbutton"></section>
```

###2、需要引入的js
```javascript
<script src="../build/pushbutton.min.js"></script>
```
###3、调用
```javascript
new Pushbutton('#pushbutton', {
    data: [
        {text:'拍照', cls: 'photo', attr: {'data-key': 'photo'} },
        {text:'录像', attr: [
            {key1: 'video2'},
            {key2: 'video2'}
        ]},
        {text:'语音录入'}
    ],
    // 点击回调 返回true 则不隐藏弹出框
    onClick: function( e ) {
        console.log(e);
        // 返回主要有用数据
        // e.target  当前dom节点
        // e.data  当前点击的data
        // e.index  当前点击的选择是第几个
        return true;
    },
    // maxHeight: 100,  // 默认显示的高度
    isShow: true   // 默认是否显示
});
var dom = document.getElementById("pushbuttonClick");
var refresh = document.getElementById("refresh");

dom.onclick = function () {
    pub.show();
}
refresh.onclick = function () {
    pub.refresh({
        data: [{text: '1321321321'}]
    });
}
```

效果图
![demo1.png](demo1.png)

###4、API

####4.1 options.data 数据
 
```javascript
options.data = [
    {text:'拍照', cls: 'photo', attr: {'data-key': 'photo'} },
    {text:'录像', attr: [
        {key1: 'video2'},
        {key2: 'video2'}
    ]},
    {text:'语音录入'}
]
```

####4.2  options.onClick 点击回调 返回true 则不隐藏弹出框
 
```javascript
options.onClick = function( e ) {
    console.log(e);
    // 返回主要有用数据
    // e.target  当前dom节点
    // e.data  当前点击的data
    // e.index  当前点击的选择是第几个
    return true;
}
```

####4.3  maxHeight  默认显示的高度
 
```javascript
options.maxHeight = 100  // 默认显示的高度
```

####4.4  isShow   默认是否显示
 
```javascript
options.isShow = false   // 默认是否显示  默认不显示
```

####4.5  show   显示
 
```javascript
Pushbutton.show()   // 显示
```

####4.6  hide   隐藏
 
```javascript
Pushbutton.hide()   // 隐藏
```

####4.7  refresh   刷新
 
```javascript
Pushbutton.refresh({
    .. // options 可以传options
})   // 刷新
```