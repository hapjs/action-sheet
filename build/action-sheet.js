(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ActionSheet = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
__$styleInject("html body{\n    margin: 0;\n}\n\n.pb-container{\n    position: fixed;\n    left: 0;\n    top: 0;\n}\n\n.pb-cover{\n    width: 100%;\n    height: 100%;\n    background: rgba(0,0,0,.3);\n}\n\n.pb-buttons{\n    position: absolute;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n}\n\n.pb-button{\n    background: #FFF;\n    padding: 10px;\n    border-radius: 5px;\n    margin: 2px;\n    text-align: center;\n}",undefined);

function keyValue(args, getter, setter){
    var attrs = {}, 
        keys, 
        key = args[0], 
        value = args[1];
    
    if(typeof key === 'object'){
        attrs = key;
    }else if(args.length === 1){
        return this[0] ? getter(this[0]) : null;
    }else{
        attrs[key] = value;
    };

    keys = Object.keys(attrs);
    
    return this.each(function(el){
        keys.forEach(function(key){
            setter(el, key, attrs);
        });
    });
};

// 查找节点，返回一个可操作的节点数组
function tethys(selector, context){

    var nodes = [];
    
    // 把参数转换为包含Node的数组
    if(selector.each && selector.on){
        // tethys 对象
        return selector;
    }else if(typeof selector === 'string'){
        // html代码或选择器
        if(selector.match(/^[^\b\B]*\</)){
            // html代码
            nodes = tethys.parseHtml(selector);
        }else{
            // 选择器
            nodes = (context || document).querySelectorAll(selector);
        };
    }else if(Array.isArray(selector) || selector.constructor === NodeList){
        // 包含节点的数组或NodeList
        nodes = selector;
    }else if(selector.constructor === Node){
        // 节点
        nodes = [selector];
    }else{
        throw 'error param';
    };

    // 当Node被appendChild方法添加到其它元素中后，该Node会被从它所在的NodeList中移除
    // 为了避免这种情况，我们要把NodeList转换成包含Node的数组
    nodes = Array.prototype.map.call(nodes, function(n){
        return n;
    });

    // 给数组添加dom操作方法
    tethys.extend(nodes, tethys.fn);

    return nodes;
};

// 扩展
tethys.extend = function(){
    var args = arguments, 
        deep = false, 
        dest, 
        prop = Array.prototype;

    if (typeof args[0] === 'boolean') {
        deep = prop.shift.call(args);
    };

    dest = prop.shift.call(args);
    
    prop.forEach.call(args, function (src) {
        Object.keys(src).forEach(function (key) {
            if (deep && typeof src[key] === 'object' && typeof dest[key] === 'object') {
                extend(true, dest[key], src[key]);
            } else if (typeof src[key] !== 'undefined') {
                dest[key] = src[key];
            };
        });
    });
    return dest;
};

// 合并数组
tethys.merge = function(ary1, ary2){
    (ary2 || []).forEach(function(n){
        ary1.push(n);
    });
};

// 把html代码转换成NodeList
tethys.parseHtml = function(str){
    var div = document.createElement('DIV');
    div.innerHTML = str;
    return div.childNodes;
};

// 微型模板
tethys.tpl = function(s, o) {
    var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
    return s.replace ? s.replace(SUBREGEX, function (match, key) {
        return typeof o[key] === 'undefined' ? match : o[key];
    }) : s;
};

// 
tethys.fn = {

    // 遍历
    each: function(fn){
        
        Array.prototype.forEach.call(this || [], fn);

        return this;
    },

    // 绑定事件
    on: function(events, fn){

        events = events.split(/\s*\,\s*/);

        return this.each(function(el){

            fn = fn.bind(el);

            events.forEach(function(event){
                el.addEventListener(event, fn);
            });
        });
    },

    // 设置css
    // css('color', 'red')
    // css({ color: 'red' })
    css: function(key, value){
        
        var format = function(key){
            return key.replace(/(-([a-z]))/g, function(s, s1, s2){
                return s2.toUpperCase();
            });
        };

        return keyValue.call(this, arguments, function(el){
            return el.style[format(key)];
        }, function(el, key, attrs){
            el.style[format(key)] = attrs[key] + '';
        });
    },

    // 设置或者返回属性
    attr: function(key, value){

        return keyValue.call(this, arguments, function(el){
            return el.getAttribute(key);
        }, function(el, key, attrs){
            el.setAttribute(key, attrs[key] + '');
        });
    },

    // 检查是否有class
    hasClass: function(cls){
        var has = false, reg = new RegExp('\\b' + cls + '\\b');

        this.each(function(el){
            has = has || !!el.className.match(reg);
        });
        
        return has;
    },

    // 添加class
    addClass: function(cls, type){
        var reg = new RegExp('\\b' + cls + '\\b');
        
        // 为所有节点添加或删除class
        return this.each(function(el){
            var name = el.className;

            if(typeof name !== 'string') return;
            
            if(type === 'remove'){
                // remove
                if(name.match(reg)) {
                    el.className = name.replace(reg, '');
                }
            }else{
                // add
                if(!name.match(reg)) {
                    el.className += ' ' + cls;
                }
            }
        });
    },

    // 删除class
    removeClass: function(cls){
        return this.addClass(cls, 'remove');
    },

    // 设置html
    html: function(html){
        return this.each(function(el){
            el.innerHTML = html;
        });
    },
    
    // 显示
    show: function(){
        return this.each(function(el){
            if(el.style.display === 'none'){
                el.style.display = el.getAttribute('o-d') || '';
            };
        });
    },
    
    // 隐藏
    hide: function(){
        return this.each(function(el){
            if(el.style.display !== 'none') {
                el.setAttribute('o-d', el.style.display);
                el.style.display = 'none';
            };
        });
    },

    // 切换显示隐藏
    toggle: function(){
        return this.each(function(el){
            var e = $(el);
            e.css("display") == "none" ? e.show() : e.hide();
        });
    },

    // 追加节点
    append: function(child){
        
        var children = tethys(child);
        
        return this.each(function(el){
            children.each(function(child, i){
                el.appendChild(child);
            });
        });
    },

    // 查找
    find: function(selector){
        var nodes = [];

        this.each(function(el){
            tethys(selector, el).each(function(node){
                nodes.push(node);
            });
        });

        return tethys(nodes); 
    }

};

const tpl = 
    `<div class="pb-container">
        <div class="pb-cover"></div>
        <div class="pb-buttons"></div>
    </div>`;

const buttonTpl = `<div class="pb-button">{text}</div>`;

var ActionSheet = function(opt){

    // 默认参数
    opt = tethys.extend({
        buttons: {}
    }, opt);
    
    // 渲染
    this.render().update(opt.buttons);
};

ActionSheet.prototype = {

    render: function(){
        var doc = document.documentElement;

        this.el = tethys(tpl);

        this.el.hide().css({
            width: doc.clientWidth + 'px',
            height: doc.clientHeight + 'px'
        });

        this.el.find('.pb-cover').on('click', this.hide.bind(this));

        tethys('body').append(this.el);
        
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
                dom = tethys(tethys.tpl(buttonTpl, {
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

return ActionSheet;

})));