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
	function classReg( className ) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {
	  hasClass = function( elem, c ) {
	    return elem.classList.contains( c );
	  };
	  addClass = function( elem, c ) {
	    elem.classList.add( c );
	  };
	  removeClass = function( elem, c ) {
	    elem.classList.remove( c );
	  };
	} else {
	  hasClass = function( elem, c ) {
	    return classReg( c ).test( elem.className );
	  };
	  addClass = function( elem, c ) {
	    if ( !hasClass( elem, c ) ) {
	      elem.className = elem.className + ' ' + c;
	    }
	  };
	  removeClass = function( elem, c ) {
	    elem.className = elem.className.replace( classReg( c ), ' ' );
	  };
	}

	function toggleClass( elem, c ) {
	  var fn = hasClass( elem, c ) ? removeClass : addClass;
	  fn( elem, c );
	}

	var classie = {
	  // full names
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  // short names
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};

	function init() {

		var overlay = document.querySelector( '.ud-overlay' );

		[].slice.call( document.querySelectorAll( '.ud-trigger' ) ).forEach( function( el, i ) {

			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) );
				// close = modal.querySelector( '.ud-close' );

			function removeModal( hasPerspective ) {
				classie.remove( modal, 'ud-show' );

				if( hasPerspective ) {
					classie.remove( document.documentElement, 'ud-perspective' );
				}
			}

			function removeModalHandler() {
				removeModal( classie.has( el, 'ud-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'ud-show' );
				overlay.removeEventListener( 'click', removeModalHandler );
				overlay.addEventListener( 'click', removeModalHandler );

				if( classie.has( el, 'ud-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'ud-perspective' );
					}, 25 );
				}
			});
			Array.from(modal.getElementsByClassName('ud-close')).forEach(function(e) {
				e.addEventListener( 'click', function( ev ) {
					ev.stopPropagation();
					removeModalHandler();
					document.getElementById('get-update-button').style = "opacity:0;";
					// document.getElementById('get-update-button')
					// document.getElementById('get-update-button').remove();
				})} );

		} );

	}

	init();

});

window.addModalEffects = ModalEffects;
ModalEffects();