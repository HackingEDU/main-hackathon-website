// Smooth scrolling plugin by Chris Coiyer
// Source: http://css-tricks.com/snippets/jquery/smooth-scrolling/
$('a[href*=#]:not([href=#])').click(function(ev) {
  ev.preventDefault();
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
	  var target = $(this.hash);
	  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	  if (target.length) {
	    $('html,body').animate({
	      scrollTop: target.offset().top
	    }, 1000);
	    window.location.hash = target.selector;
	    return false;
	  }
	}
});

// Click anywhere on navbar to show menu on mobile
$('#header').on('click', function(){
  if ($('.navbar-toggle').css('display') === 'none') return false; //Check if mobile view
  $('#header').hasClass('in') ? $(".navbar-collapse").collapse('hide') : $(".navbar-collapse").collapse('show');
});

var lastClicked = null;
$('.nav a').on('click', function() {
	if (lastClicked != null) {
		lastClicked.css('font-weight', 'normal');
	}

	$(this).css('font-weight', 'bold');
	lastClicked = $(this);
});
