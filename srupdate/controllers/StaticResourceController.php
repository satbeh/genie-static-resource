<?php
class StaticResourceController
{
    public function handleFormSubmission(){
    	if(isset($_POST['update_cb_assets'])){
    		$this->update('CB');
    	}else if(isset($_POST['update_pl_assets'])){
    		$this->update('Pl2');
    	}else if(isset($_POST['update_genie_assets'])){
    		$this->update('Genie');
    	}
    }
    
    public function update($resourceName) {
    }
}
?>