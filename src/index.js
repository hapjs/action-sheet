import $ from './tethys.js';
import './index.css';

function Pushbutton(element, options) {
    this.ele = $(element);
    var id   = this.ele.attr('id');
    // 如果没有ID 则自动创建一个id
    if (!id) {
        id = 'pushbutton' + Math.random().toString().replace('0.', '');
        this.ele.attr('id', id);
    }
    this.id = $('#' + id);
    this.init(options);
}

Pushbutton.prototype = {
    version: '1.0.0',
    // 初始化
    init: function (options) {
        this.options = {};
        this.options.maxHeight = 240;
        this.options.animateIn = 'pushbutton-in';
        this.options.animateOut = 'pushbutton-out';

        // 继承
        $.extend(this.options, options);
        // 执行render
        this.render();
    },
    // 入口
    render: function () {
        this.id.addClass('widget-ui-pushbutton').html(this.createTpl());
        this.show();
        // 事件
        this.event();
    },
    // 销毁pushbutton
    destroy: function () {
        this.id.remove();
    },
    // 刷新pushbutton
    refresh: function (op) {
        if (!op) {
            op = this.options;
        } else {
            $.extend(this.options, op);
        }
        this.init(op);
    },
    // 遍历obj
    forInAttr: function (data) {
        var attr = '', key;
        for (key in data) {
            attr += key + '="' + data[key] + '" ';
        }
        return attr;
    },
    // 创建模板
    createTpl: function () {
        var dataF, cls, key, text, attr, i = 0, n = 0, arr, arrLen = 0;
        var op = this.options;
        var data = op.data;
        var id = this.id;
        if (!Array.isArray(data)) {
            data = [];
        }
        var len = data.length;
        var tpl = '<div class="widget-ui-pushbutton-list" style="max-height:' + op.maxHeight + 'px;">';

        for (; i < len; i++) {
            dataF = data[i];
            cls = dataF.cls || '';
            text = dataF.text || '';
            arr = dataF.attr;
            attr = '';
            if (typeof arr == 'object' && !Array.isArray(arr)) {
                attr += this.forInAttr(arr);
            } else if (Array.isArray(arr)) {
                arrLen = arr.length;
                for (n = 0; n < arrLen; n++) {
                    attr += this.forInAttr(arr[n]);
                }
            }

            tpl += '<a href="javascript:void(0);" tabIndex="' + i + '" class="list-a ' + cls + '" ' + attr + '>' + text + '</a>';
        }
        tpl += '<a href="javascript:void(0);" class="pushbutton-cancel">取消</a>\
                </div>';
        return tpl;
    },
    // 事件
    event: function () {
        var id = this.id;
        var op = this.options;
        var data = op.data || [];
        var onClick = op.onClick;
        var flag = false;
        var cls = [];
        var dom = '';

        // 点击
        id.on('click', function (e) {
            dom = e.target || e.srcElement;
            flag = false;
            // 点击第二条数据
            e.index = e.target.tabIndex;
            e.data = data[e.index];
            if (typeof onClick === 'function') {
                // 如果点击的回调函数返回true则不隐藏弹出框
                flag = onClick(e);
                // 如果点击的元素是数据生成的则不隐藏
                if (!flag || !$(dom).hasClass('list-a')) {
                    this.hide();
                }
            } else {
                this.hide();
            }
            
        }.bind(this));
        
    },
    // 显示
    show: function () {
        var In = this.options.animateIn;
        this.id.show().addClass(In);
    },
    // 隐藏
    hide: function () {
        var op = this.options;
        var In = op.animateIn;
        var Out = op.animateOut;
        var id = this.id;
        id.addClass(Out);
        setTimeout(function() {
            id.removeClass(Out + ' ' + In).hide();
        }, 351);
    }
}

export default Pushbutton;