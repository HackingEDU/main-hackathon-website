// Smooth scrolling plugin by Chris Coiyer
// Source: http://css-tricks.com/snippets/jquery/smooth-scrolling/
function smoothNav(hash) {
  // @hash: accepts jQuery hash property

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

var lastClicked = null;
$('a[href*=#]:not([href=#])').click(function(ev) {
  if(!ev.currentTarget.href.includes("2015")){ // External URL. <2015.hackingedu.co>
  ev.preventDefault();
	if (lastClicked != null) {
		lastClicked.css('font-weight', 'normal');
	}

	$(this).css('font-weight', 'bold');
	lastClicked = $(this);

  smoothNav(this.hash);
  return false;
}
});


$('#nav-press-butt').click(function() {
  window.open('https://drive.google.com/file/d/0BzI2Lz_qv89jeHZnVHQ3ZjlrUlE/view', '_blank');
  return true;
});

$("#nav-apply-butt").click(function() {
  window.open("http://2015.hackingedu.co/", "_blank");
  return true;
});

// Click anywhere on navbar to show menu on mobile
$('#header').on('click', function(){
  if ($('.navbar-toggle').css('display') === 'none') return false; //Check if mobile view
  $('#header').hasClass('in') ? $(".navbar-collapse").collapse('hide') : $(".navbar-collapse").collapse('show');
});

