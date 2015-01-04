(function(global){
  'use strict';

  global.$w = global.$w || $;

  function initialize() {
    console.log('hi, iniitalized');

    // listen for scroll
 //   $w(window).on('scroll', _.throttle(enableParallax, 300));
    var s = global.skrollr.init();
  }

  function enableParallax() {
//    console.log('enableParallax', global.pageYOffset);

    if (global.pageYOffset > 0) {
      $w('.parallax-enabled').addClass('fixed-image');
    }

    if (global.pageYOffset <= 0) {
      $w('.parallax-enabled').removeClass('fixed-image');
    }
  }

  global.$w(initialize);

})(window);
