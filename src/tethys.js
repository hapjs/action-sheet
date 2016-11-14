

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
    
    if(typeof selector === 'string'){
        if(selector.match(/^[^\b\B]*\</)){
            nodes = [ tethys.parseDOM(selector) ];
        }else{
            nodes = (context || document).querySelectorAll(selector);
        };
    }else{

        nodes = [selector];
    };

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

// html to dom
tethys.parseDOM = function(str){

    var parser;

    if(typeof str === 'string'){
        parser = new DOMParser();
        str = parser.parseFromString(str, "text/xml").firstChild;
    };

    return str;
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
        
        child = tethys.parseDOM(child);

        return this.each(function(el){
            el.appendChild(child);
        });
    }

};

export default tethys;
