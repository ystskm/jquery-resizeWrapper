// Copyright (c) ystskm
// https://github.com/ystskm/jquery-resizeWrapper/LICENSE
(function($) {
  $.fn.resizeAccordionair = function() {
    if(!$.ui || !$.ui.draggable)
      throw new Error('Require jQuery-ui draggable.');

    if(this.length != 2)
      throw new Error('Must 2 items for resizeAccordionair.');

    var one = this.eq(0), two = this.eq(1);
    if(one.siblings().index(two) == -1)
      throw new Error('Must neiborfood for resizeAccordionair');

    var w1 = one.width(), h1 = one.height(), o1 = one.offset();
    var w2 = two.width(), h2 = two.height(), o2 = two.offset();
    var wd = 4, spos = w1 + parseInt((o2.left - w1 - o1.left - wd) / 2);
    var div = $('<div/>').css({
      position: 'absolute',
      left: spos,
      top: 0,
      width: wd,
      height: Math.max(h1, h2),
      border: '1px solid #888',
      cursor: 'w-resize',
      zIndex: 9999
    });
    one.after(div);

    div.draggable({
      axis: 'x',
      start: function(e, ui) {
      },
      drag: function(e, ui) {
        var diff = ui.position.left - spos;
        one.width(w1 + diff), two.width(w2 - diff), two.offset({
          left: o2.left + diff
        });
      },
      stop: function(e, ui) {

      }
    });

  };
})(window.jQuery);
