import './action-sheet.css'
import $ from '../lib/tethys.js'
import Tap from '../lib/tap.js'

const tpl = 
    '<div class="pb-container">\
        <div class="pb-cover"></div>\
        <div class="pb-buttons"></div>\
    </div>';

const buttonTpl = '<div class="pb-button">{text}</div>';

var ActionSheet = function(opt){

    // 默认参数
    opt = $.extend({
        buttons: {}
    }, opt);
    
    // 渲染
    this.render().update(opt.buttons);
};

function ontap(el, fn){
    new Tap(el);
    el.addEventListener('tap', fn, false);
}

ActionSheet.prototype = {

    render: function(){
        var doc = document.documentElement;

        this.el = $(tpl);

        this.el.hide().css({
            width: doc.clientWidth + 'px',
            height: doc.clientHeight + 'px'
        });

        ontap(this.el.find('.pb-cover')[0], this.hide.bind(this));

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
                btn = $($.tpl(buttonTpl, {
                    text: key
                }));
            //
            ontap(btn[0], function(e){
                e.stopPropagation();
                e.preventDefault();
                if(typeof this === 'function'){
                    this(e);
                }else if(typeof this === 'string'){
                    location.href = this;
                };
            }.bind(n));

            buttonContainer.append(btn);
        });

        return this;
    }
};

export default ActionSheet;