import './action-sheet.css'
import $ from '../lib/tethys.js'
import Tap from '../lib/tap.js'

const tpl = 
    '<div class="as-container">\
        <div class="as-cover"></div>\
        <div class="as-buttons"></div>\
    </div>';

const buttonTpl = '<div class="as-button">{text}</div>';

var ActionSheet = function(opt){

    // 默认参数
    opt = $.extend({
        buttons: {},
        inTime: 500,
        outTime: 500
    }, opt);
    
    // 渲染
    this.render().update(opt.buttons);
};

// 绑定点击事件
function bindTapEvent(el, fn){
    new Tap(el);
    el.addEventListener('tap', fn, false);
}

ActionSheet.prototype = {

    // 初始化渲染
    render: function(){
        var doc = document.documentElement;

        this.el = $(tpl);

        this.el.hide().css({
            width: doc.clientWidth + 'px',
            height: doc.clientHeight + 'px'
        });

        bindTapEvent(this.el.find('.as-cover')[0], this.hide.bind(this));

        $('body').append(this.el);
        
        return this;
    },

    // 显示
    show: function(){


        this.el.show();
        this.el.addClass('as-in');

        setTimeout(function(){
            this.el.removeClass('as-in');
        }.bind(this), 350);

        return this;
    },

    // 隐藏
    hide: function(){

        this.el.addClass('as-out');

        setTimeout(function(){
            this.el.removeClass('as-out').hide();
        }.bind(this), 300);
        
        return this;
    },

    // 更新按钮
    update: function(buttons){
        var buttonContainer = this.el.find('.as-buttons');

        // 清空按钮容器
        buttonContainer.html('');

        // 添加取消按钮
        buttons['取消'] = this.hide.bind(this);
        
        // 遍历创建按钮
        Object.keys(buttons).forEach(function(key){
            var n = buttons[key],
                btn = $($.tpl(buttonTpl, {
                    text: key
                }));

            // 绑定tap事件
            bindTapEvent(btn[0], function(e){

                e.stopPropagation();
                e.preventDefault();
                
                // 如果参数是函数则调用
                // 如果是字符串则认为是url直接跳转
                if(typeof this.action === 'function'){
                    this.action.call(this.context, e);
                }else if(typeof this.action === 'string'){
                    location.href = this.action;
                };
            }.bind({action: n, context: this}));

            // 触摸反馈
            btn.on('touchstart', function(e){
                $(e.target).addClass('as-active');
            }).on('touchend', function(e){
                $(e.target).removeClass('as-active');
            });

            // 添加到按钮容器
            buttonContainer.append(btn);
        }.bind(this));

        return this;
    }
};

export default ActionSheet;