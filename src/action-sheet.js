import './action-sheet.css';
import $ from '../lib/tethys.js'

const tpl = 
    `<div class="pb-container">
        <div class="pb-cover"></div>
        <div class="pb-buttons"></div>
    </div>`;

const buttonTpl = `<div class="pb-button">{text}</div>`;

var ActionSheet = function(opt){

    // 默认参数
    opt = $.extend({
        buttons: {}
    }, opt);
    
    // 渲染
    this.render().update(opt.buttons);
};

ActionSheet.prototype = {

    render: function(){
        var doc = document.documentElement;

        this.el = $(tpl);

        this.el.hide().css({
            width: doc.clientWidth + 'px',
            height: doc.clientHeight + 'px'
        });

        this.el.find('.pb-cover').on('click', this.hide.bind(this));

        $('body').append(this.el);
        
        return this;
    },

    show: function(){

        this.el.show();
        return this;
    },

    hide: function(){
        this.el.hide();
        return this;
    },

    update: function(buttons){
        var buttonContainer = this.el.find('.pb-buttons');

        buttonContainer.html('');

        buttons['取消'] = this.hide.bind(this);
        
        Object.keys(buttons).forEach(function(key){
            var n = buttons[key],
                dom = $($.tpl(buttonTpl, {
                    text: key
                }));
            //
            dom.on('click', function(e){
                if(typeof this === 'function'){
                    this(e);
                }else if(typeof this === 'string'){
                    location.href = this;
                };
            }.bind(n));

            buttonContainer.append(dom);
        });

        return this;
    }
};

export default ActionSheet;