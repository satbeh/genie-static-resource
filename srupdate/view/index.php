<?php 
	require_once 'controllers/AppController.php';
	
	$appController = AppController::getInstance();
	$appController->handleFormSubmission();
		
	include_once 'view/common/header.php';
	
	if($appController->sforceLoginController->isLoggedIn())
		include_once 'view/update_resource.php';
	else
		include_once 'view/login_form.php';
	
	include_once 'view/common/footer.php';
?>

