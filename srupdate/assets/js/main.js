$(function(){
	var handle_error = function (type, msg, preformat){
		if(type && type === 'hide'){
			$('#app_alert').hide();
			return false;
		}

		type = type || 'error';
		var alerts = { error: 'alert-danger', info: 'alert-info', success: 'alert-success'};

		$('#app_alert').removeClass().addClass('alert ' + alerts[type]).html(msg).show();
	};

	$('#update_cb_assets').click(function(){
		handle_error('info', 'This may take few minutes, please wait...');
		$('#download_links').hide();
		$.ajax({
			url: '/update_static_resources?name=CB',
			method: 'GET',
			success: onSuccess,
			error: onError
		});
	});

	$('#update_pl_assets').click(function(){
		handle_error('info', 'This may take few minutes, please wait...');
		$('#download_links').hide();
		$.ajax({
			url: '/update_static_resources?name=Pl2',
			method: 'GET',
			success: onSuccess,
			error: onError
		});
	});

	$('#update_genie_assets').click(function(){
		handle_error('info', 'This may take few minutes, please wait...');
		$('#download_links').hide();
		$.ajax({
			url: '/update_static_resources?name=Genie',
			method: 'GET',
			success: onSuccess,
			error: onError
		});
	});

	function onSuccess(result){
		if(typeof result === 'string' || result.error){
			handle_error('error', result.error ? result.error : result, !result.error);
			return false;
		}

		handle_error('success', 'Resource has been updated.');
	}

	function onError(jqXHR, textStatus, errorThrown){
		handle_error('error', errorThrown);
	}
});
