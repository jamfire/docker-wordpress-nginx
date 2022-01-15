( function( $, api ) {
	var $window = $( window ),
		$document = $( document ),
		$body = $( 'body' );
	/**
	 * API on ready event handlers
	 *
	 * All handlers need to be inside the 'ready' state.
	 */
	wp.customize.bind( 'ready', function() {
		/**
		 * Init import export.
		 */
		var kadenceImportExport = {
			init: function() {
				$( 'input[name=kadence-starter-export-button]' ).on( 'click', kadenceImportExport.export );
				$( 'input[name=kadence-starter-import-button]' ).on( 'click', kadenceImportExport.import );
				$( 'input[name=kadence-starter-reset-button]' ).on( 'click', kadenceImportExport.reset );
			},
		
			export: function() {
				window.location.href = kadenceStarterImport.customizerURL + '?kadence-starter-export=' + kadenceStarterImport.nonce.export;
			},
			import: function() {
				var win			= $( window ),
					body		= $( 'body' ),
					form		= $( '<form class="kadence-starter-import-form" method="POST" enctype="multipart/form-data"></form>' ),
					controls	= $( '.kadence-starter-import-controls' ),
					file		= $( 'input[name=kadence-starter-import-file]' ),
					message		= $( '.kadence-starter-uploading' );
				
				if ( '' == file.val() ) {
					alert( kadenceStarterImport.emptyImport );
				}
				else {
					win.off( 'beforeunload' );
					body.append( form );
					form.append( controls );
					message.show();
					form.submit();
				}
			},
			reset: function() {
				var data = {
					wp_customize: 'on',
					action: 'kadence_starter_reset',
					nonce: kadenceStarterImport.nonce.reset
				};
		
				var r = confirm( kadenceStarterImport.resetConfirm );
		
				if (!r) return;
		
				$( 'input[name=kadence-starter-reset-button]' ).attr('disabled', 'disabled');
		
				$.post( ajaxurl, data, function () {
					wp.customize.state('saved').set( true );
					location.reload();
				});
			}
		};
		
		$( kadenceImportExport.init );
	});

} )( jQuery, wp );