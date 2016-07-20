<?php
require_once ('lib/soapclient/SforcePartnerClient.php');

class SforceLoginController
{
    public function __construct(){
    }
	
    public function handleFormSubmission(){
    	if(isset($_POST['login'])){
    		$this->login($_POST['uname'], $_POST['pass']);
    	}else if(isset($_POST['logout'])){
    		$this->logout();
    	}
    } 
    
    public function isLoggedIn(){
    	return isset($_SESSION["accessToken"]);
    }
    
    protected function login($username, $password){
    	if(!$this->isLoggedIn()){
    		try {
    		$mySforceConnection = new SforcePartnerClient();
    		$mySforceConnection->createConnection(getcwd()."\lib\soapclient\partner.wsdl.xml");
    		$res = $mySforceConnection->login($username, $password);
    		print_r($res);
    		}catch (SoapFault $fault) {
    			echo $fault->faultstring;
    		}
    		
    		exit;    		
    
    		header("Refresh:0");
    	}
    }
    
    protected function logout(){
    	if($this->isLoggedIn())
    		unset($_SESSION['accessToken']);
    		header("Refresh:0");
    }
    
    protected function setSession(){
    	$_SESSION["accessToken"] = $this->accessToken;
    }
}
?>