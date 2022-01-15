/**
 * Ajax install the Theme Plugin
 *
 */
 (function($, window, document, undefined){
	"use strict";
	$(function(){
		$( '.starter-upsell-wrap .starter-upsell-dismiss' ).on( 'click', function( event ) {
			kadence_starter_dismissNotice();
		} );
		function kadence_starter_dismissNotice(){
			var data = new FormData();
			data.append( 'action', 'kadence_starter_dismiss_notice' );
			data.append( 'security', kadenceStarterAdmin.ajax_nonce );
			$.ajax({
				url : kadenceStarterAdmin.ajax_url,
				method:  'POST',
				data: data,
				contentType: false,
				processData: false,
			});
			$( '.starter-upsell-wrap' ).remove();
		}
	});
})(jQuery, window, document);