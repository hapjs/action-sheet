import $ from './tethys.js'

const tpl = `
    <div class="pb-container" style="display:none">
        <div class="pb-cover"></div>
        <div class="pb-buttons"></div>
    </div>
`;

const buttonTpl = `
    <div class="pb-button">{text}</div>
`;

var PushButton = function(opt){

    // 默认参数
    opt = $.extend({
        buttons: {}
    }, opt);

    // copy buttons
    this.buttons = JSON.parse(JSON.stringify(opt.buttons));

    // 渲染
    this.render();
};

PushButton.prototype = {

    render: function(){
        this.el = $(tpl);

        $('body').append(this.el);
    },

    show: function(){

    },

    hide: function(){

    },

    update: function(buttons){
        this.buttons = buttons;
    }
};

export default PushButton;