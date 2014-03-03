// Copyright (c) ystskm
// https://github.com/ystskm/jquery-resizeWrapper/LICENSE
(function($) {
  var Default = {
    Selector: '.wrapper',
    Options: {
      expect: 1280,
      delay: 300
    },
    EachOptions: {
      css: [],
      animate: ['width', 'margin-left', 'margin-right'],
      duration: 300
    }
  };
  $.resizeWrapper = function(setting, options, callback) {
    if($.isFunction(options))
      callback = options, options = {};

    var win_width = $(window).width(), win_height = $(window).height();

    var onaction = false;

    if(!hasKey(setting))
      setting = {}, setting[Default.Selector] = {};
    options = $.extend({}, Default.Options, options);

    $(window).resize(start);

    if(win_width != options.expect)
      win_width = options.expect, start();

    function start(e) {
      var diff_w = 0, diff_h = 0;
      if(!onaction
        && (diff_w = $(window).width() - win_width
          || (diff_h = $(window).height() - win_height)))
        onaction = true, timer = setTimeout(function() {
          resize(diff_w ? diff_w > 0: diff_h > 0);
        }, options.delay);
    }
    function resize(direction) {
      resizeFunction(setting, direction);
    }
    function resizeFunction(setting, direction, parent, dfd) {
      var i = null, fn = null, selectors = Object.keys(setting);

      parent = parent || $(window);
      dfd = dfd || $.Deferred();

      set(), resizeOne();

      function set() {
        if(direction)
          i = -1, fn = plus;
        else
          i = selectors.length, fn = minus;
      }
      function resizeOne() {
        if(fn())
          $.when(eachResize()).then(resizeOne);
        else
          $.isFunction(callback) ? callback(): $.noop(), onaction = false;
      }
      function plus() {
        return i++ < selectors.length;
      }
      function minus() {
        return i--;
      }
      function eachResize() {
        return $(selectors[i]).each(function(idx, dom) {
          eachcb(selectors[i], dom);
        }), dfd.promise();
      }
      function initEachSetting(one) {
        one.css = [].concat(one.css || []);
        one.anm = [].concat(one.animate || []);
        one.rel = one.relation || {};
        for( var i in one.rel) {
          one.rel[i].css = [].concat(one.rel[i].css || []);
          one.rel[i].anm = [].concat(one.rel[i].animate || []);
        }
        return $.extend({}, Default.EachOptions, one);
      }
      function eachcb(i, dom) {

        var one = initEachSetting(setting[i]);
        var winw_resized = $(window).width(), winh_resized = $(window).height();

        var promises = [];
        for( var j = 0; j < one.css.length; j++)
          promises.push($(dom).css(calc(dom, one.css[j], winw_resized)));
        for( var j = 0; j < one.anm.length; j++)
          promises.push(animatePromise(calc(dom, one.anm[j], winw_resized)));

        $.when.apply($, promises).then(function() {
          if(hasKey(one.relation))
            return resizeFunction(one.relation, direction, dom, dfd);
          // the last of one resize
          if($.isFunction(one.callback))
            one.callback();
          win_width = winw_resized, win_height = winh_resized;
          dfd.resolve();
        });

        function animatePromise(stat) {
          var anm_dfd = $.Deferred();
          $(dom).animate(stat, one.duration, function() {
            anm_dfd.resolve();
          });
          return anm_dfd.promise();
        }
      }
      function calc(dom, tgts, winw_resized) {
        var resized = {};
        for( var name in tgts) {
          var tgt = tgts[name];
          if(typeof tgt == 'string')
            tgt = {}, tgt[name] = true;
          resized[name] = setResized(name, tgt, stat(dom, name), stat(parent,
            name));
        }
        // debug
        /*
        console.log('TAG:' + dom.tagName + ',ID:' + dom.id + ',CLASS:' + dom.className);
        console.log(resized);
        */
        return resized;
        function setResized(name, fn, dom_stat, parent_stat) {
          if($.isFunction(fn))
            return fn(dom_stat, winw_resized, win_width, parent_stat);
          if(fn === true)
            return parent_stat;
          else
            return fn;
        }
        function stat(dom, dirc) {
          var css = null, $dom = $(dom);
          try {
            css = $dom.css(dirc);
            if(css == 'auto' && $dom.position()[dirc] != null)
              css = $dom.position()[dirc] + 'px', $dom.css(dirc, css);
          } catch(e) {
            if($(window).is(dom))
              css = 0;
          };
          if(css == null) {
            if($.isFunction($dom[dirc]))
              return $dom[dirc]() + 'px';
            return '0px';
          }
          return css;
        }
      }
    }
    function hasKey(obj) {
      return typeof obj == 'object' && Object.keys(obj).length;
    }
  };
})(window.jQuery);
