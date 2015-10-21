/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var ModalEffects = (function() {

	function init() {
    /* FIXED CLOSE BUTTON HACK */
    var close = document.querySelector( '.md-close-hack' );

		[].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {
			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) );
				//close = modal.querySelector( '.md-close' );

			function removeModal( hasPerspective ) {
				classie.remove( modal, 'md-show' );

				if( hasPerspective ) {
					classie.remove( document.documentElement, 'md-perspective' );
				}
			}

			function removeModalHandler() {
				removeModal( classie.has( el, 'md-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'md-show' );
				close.removeEventListener( 'click', removeModalHandler );
				close.addEventListener( 'click', removeModalHandler );

        // FIXED DISPLAY ISSUES
        modal.style.overflowY = "auto";
        close.style.display = "block";

				if( classie.has( el, 'md-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'md-perspective' );
					}, 25 );
				}
			});

			close.addEventListener( 'click', function( ev ) {
				ev.stopPropagation();

        // FIXED DISPLAY ISSUES
        modal.style.overflowY = "hidden";
        close.style.display = "none";

				removeModalHandler();
			});

		} );

	}

	init();

})();
