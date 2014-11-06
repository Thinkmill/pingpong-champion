jQuery(function($) {

	// Common
	// ---------------

	// generic confirm
	
	$('a[data-confirm], button[data-confirm]').click(function(e) {
		if (!confirm($(this).data().confirm)) {
			e.preventDefault();
			return false;
		}
	});
	
	
	// generic reveal
	
	$('a[data-show], button[data-show]').each(function() {

		var data = $(this).data(),
			showEl = $(data.show),
			hideEl = data.hide === 'this' ? $(this) : $(data.hide);
		
		// hide the target element initially
		if (data['init']) {
			showEl.hide();
		}

		$(this).click( function() {
			hideEl.hide();
			 
			// show the target and focus the first viable form control
			// click ensures browse is envoked on file fields
			// select the input contents to simulate a tab-in
			showEl.show().find('input[type!=hidden],textarea').eq(0).click().focus().select();
		});
	});

	
	// hide successful flash messages after timeout

	$('.flash-messages').has('.alert-success').each(function() {
		$(this).delay(4000).animate({
			opacity: 0,
			height: 0
		}, 400, 'swing', function() {
			$(this).hide()
		});
	});
	
	
	// focus the first modal field if there is one
	
	// $('.modal').each(function() {
		
	// 	var self = $(this);
		
	// 	self.on('shown.bs.modal', function (e) {
	// 		self.find('input[type!=hidden]:not([type=radio]),textarea').eq(0).click().focus();
	// 	});
	// });

	//- populate extra markup on loading-button with JS
	//- add class "is-processing" to the parent form
	//- disable interactions on the form whilst it's processing
	$('button[data-submit-label]').each(function() {

		var $button = $(this),
			$label = $button.data('submit-label');

		// populate inner html
		$button.addClass('loading-button').html('<span class="loading-button-icon-wrapper"><span class="loading-button-icon" /></span><span class="loading-button-text">' + $label + '</span');
		
		// process the form
		$button.click(function(e) {

			var $form = $button.closest('form');

			e.preventDefault();

			$form.addClass('is-processing');

			setTimeout(function() {
				$form.submit();
			}, 1200);

		});
	});
	
	
	// populate the markup for better styled select fields
	
	$('.select-field').each(function() {
		
		var self = $(this);
		
		self.wrap('<div class="select-field-container" />');
		self.after('<span class="select-field-indicator"><span class="select-field-indicator-arrow"></span></span>');
	});
	$('.select-chromeless').each(function() {
		
		var self = $(this);
		
		self.wrap('<div class="select-chromeless-container" />');
		self.after('<span class="select-chromeless-indicator"><span class="select-chromeless-indicator-arrow"></span></span>');
	});
	
	
	// Init Bootstrap tools
	// ------------------------------
	$("[rel='tooltip']").tooltip();
	$("[data-toggle='popover']").popover();
	
	// Hide popovers on body click
	$('body').on('click', function (e) {
		$('[data-toggle="popover"]').each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');
			}
		});
	});
	
});