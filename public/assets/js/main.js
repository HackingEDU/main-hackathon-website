// Smooth scrolling plugin by Chris Coiyer
// Source: http://css-tricks.com/snippets/jquery/smooth-scrolling/
function smoothNav(hash) {
  // @hash: accepts JS hash property

  // Find hash element on page
  var target = $(hash);
  target = target.length ? target : $('[name=' + hash.slice(1) +']');

  if (target.length) {
    // Scroll down to hash element on page
    $('html,body').animate({
      scrollTop: target.offset().top
    }, 1000);

    // Push history element to prevent page from navigating to hash
    if(history.pushState) {
      history.pushState(null, null, target.selector);
    } else {
      location.hash = target.selector;
    }
  }
}

$('.navbar-nav a').click(function(ev) {
  ev.preventDefault();
  smoothNav(this.hash);
});
