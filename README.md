## what is it?

jquery.resizeWrapper.js assists your implement of resizing objects.

## syntax

$.resizeWrapper([options])

## example:

```js
$.resizeWrapper({
  target: 'aside',
});
```

## it means:

when "window" is resized ,$('aside') of 'width', 'margin-left', 'margin-right'
are automatically adjusted related on window-resized-width / window-width after
500 ms duration.

## default setting

```js
{
  expect: 1280,
  duration: 500,
  target: '.wrapper',
  css: [],
  animate: ['width', 'margin-left', 'margin-right'],
  relation: null
}
```

The options means :

* `expect`         - first resize occurs if $(window).width() is not equals this.
   (int)
* `duration`       - The millisecond of action start duration after window resized.
   (int)
* `target`         - The element selector(s) related to $(window).resize action.
   (string, array[string|object{string:function}])
* `css`            - no animated change parameter(s)
   (string, array[string|object{string:function}])
* `animate`        - animated change parameter(s)
   (string, array[string|object{string:function}])
* `relation`       - 
   (object: same as the structure of options) 

## example2:

```js
$.resizeWrapper({
  target: '.r-wrapper',
  animate: ['margin-left', {
    width: calcW
  }],
  relation: {
    '#main-container': {
      css: 'height'
    },
    '.r-wrapper > iframe': {
      css: [{
        'width': calcIW
      }, 'height']
    }
  }
});
function calcW(dom_stat, win_resized, win_width) {
  var wrOffset = $('aside').offset().left;
  var wrMargin = parseInt($('.r-wrapper').css('margin-left').replace('px', ''));
  var wr = (wrOffset + wrMargin) * win_resized / win_width;
  var one = 6 + 250 + 6;
  return parseInt((win_resized - wr)/one) * one+ 'px';
};
function calcIW(dom_stat, win_resized, win_width) {
  return $('.r-wrapper').width();
};
```

## examples url

now on preparing

## minimize it

```
curl \
  -d output_info=compiled_code \
  -d compilation_level=SIMPLE_OPTIMIZATIONS \
  -d code_url=https://github.com/ystskm/jquery-resizeWrapper/raw/master/jquery.pjax.js \
  http://closure-compiler.appspot.com/compile
```
