// Copyright (c) ystskm
// https://github.com/ystskm/jquery-resizeWrapper/LICENSE
(function($){
  $.resizeWrapper = function(options) {
    options = $.extend({
      expect: 1280,
      duration: 500,
      target: '.wrapper',
      css: [],
      animate: ['width', 'margin-left', 'margin-right'],
      relation: null
    }, options);
    var arr = [].concat(options['target']);
    var css = [].concat(options['css']);
    var anm = [].concat(options['animate']);
    var relation = options['relation'] || {};
    for( var i in relation) {
      relation[i].css = [].concat(relation[i].css || []);
      relation[i].anm = [].concat(relation[i].animate || []);
    }
  
    var win_width = $(window).width(), onaction = false;
  
    $(window).resize(start);
  
    if(win_width != options['expect']) {
      win_width = options['expect'];
      resize();
    }
  
    function start(e) {
      if(onaction === false) {
        onaction = true;
        timer = setTimeout(resize, options.duration);
      }
    }
    function resize() {
      for( var i = 0; i < arr.length; i++)
        $(arr[i]).each(eachcb);
      onaction = false;
    }
    function eachcb(i, dom) {
      var win_resized = $(window).width();
      $(dom).css(calc(dom, css, win_resized));
      rel_resize(dom);
      $(dom).animate(calc(dom, anm, win_resized), function() {
        rel_resize(dom);
      });
      win_width = win_resized;
    }
    function rel_resize(dom) {
      var win_resized = $(window).width();
      for( var i in relation) {
        var name = null, fn = null, tgts;
        tgts = relation[i].css;
        if(tgts.length)
          for( var j = 0; j < tgts.length; j++) {
            if(typeof tgts[j] == 'object') {
              name = Object.keys(tgts[j])[0];
              fn = tgts[j][name];
            } else {
              name = tgts[j];
              fn = null;
            }
            if($.isFunction(fn))
              $(i).css(name, fn($(dom).css(name), win_resized, win_width));
            else
              $(i).css(name, $(dom).css(name));
          }
        tgts = relation[i].anm;
        if(tgts.length){
          var resized = {};
          for( var j = 0; j < tgts.length; j++) {
            if(typeof tgts[j] == 'object') {
              name = Object.keys(tgts[j])[0];
              fn = tgts[j][name];
            } else {
              name = tgts[j];
              fn = null;
            }
            if($.isFunction(fn))
              resized[name] = fn($(dom).css(name), win_resized, win_width);
            else
              resized[name] = $(dom).css(name);
          }
          $(i).animate(resized);
        }
      }
    }
    function calc(dom, tgts, win_resized) {
      var resized = {};
      for( var j = 0; j < tgts.length; j++) {
        var name = null, fn = null;
        if(typeof tgts[j] == 'object') {
          name = Object.keys(tgts[j])[0];
          fn = tgts[j][name];
        } else
          name = tgts[j];
  
        var dom_width, unit, dom_stat = stat($(dom), name);
        
        // TODO more correct
        // var dom_restw = $.data(dom, 'rest_width') || 0;
  
        if(/^(\d+)(\D+)$/.test(dom_stat)) {
          if(typeof fn == 'function')
            resized[name] = fn.call(dom, dom_stat, win_resized, win_width);
          else {
            switch(RegExp.$2) {
            case '%':
              dom_width = parseInt(win_width * RegExp.$1 / 100);
              unit = 'px';
              $(dom).css(name, dom_width + unit);
              break;
            default:
              dom_width = RegExp.$1;
              unit = RegExp.$2;
            }
            resized[name] = parseInt(win_resized * dom_width / win_width) + unit;
          }
        } else
          throw new Error('unexpected css value for resizeWrapper.js');
      }
      return resized;
    }
    function stat(dom, dirc) {
      var css = null;
      try {
        css = dom.css(dirc);
      } catch(e) {
      };
      return (css == null) ? dom[dirc]() + 'px': css;
    }
  };
})(window.jQuery);
