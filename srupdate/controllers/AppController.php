<?php
require_once 'config/AppConfig.php';
require_once 'controllers/SforceLoginController.php';
require_once 'controllers/StaticResourceController.php';

class AppController
{	
	public static $instance;
	public $config;
    public $sforceLoginController;
    
    public static function getInstance(){    	
    	if (NULL == self::$instance) {
    		self::$instance = new AppController();
    	}
    	return self::$instance;    	
    }
    
    public function handleFormSubmission(){
    	if(isset($_POST['login']) || isset($_POST['logout'])){
    		$this->sforceLoginController->handleFormSubmission();
    	}
    	
    	if(isset($_POST['update_assets'])){
    		$src = new StaticResourceController();
    		$src->handleFormSubmission();
    	}
    }
    
    private function __construct(){    	
    	$this->startSession();    	
    	$this->config = new AppConfig();
    	$this->sforceLoginController = new SforceLoginController();
    }

    private function startSession(){
		session_start();
    } 
}
?>