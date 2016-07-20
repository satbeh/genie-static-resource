<?php	
class AppConfig
{	
	public static $VF_FILE_NAMES = array(
		"CB" => array(
			"CB_task_template",
			"CB_create_add_on_template",
			"CB_account_detail_template",
			"CB_list_view_template",
			"CB_grid_view_template",
			"CB_contact_detail_template",
			"CB_home_template",
			"CB_dashboard_template",
			"CB_charts_template",
			"CB_90drenewals_template",
			"CB_account_easybi_template",
			"CB_playbook_email_template",
			"CB_ltask_detail_template",
			"CB_acchighlight_new_template",
			"CB_acchighlight_renewal_template",
			"CB_acchighlight_enterprise_template",
			"CB_acchighlight_lss_template",
			"CB_acchighlight_lssspc_template",
			"CB_acchighlight_lms_template",
			"CB_footer_template",
			"CB_reports_template",
			"CB_churnguard_template",
			"CB_lss_retention_board_template",
				
			"CB_other_js",
			"CB_utility_js",
			"CB_worker_js",
			"CB_list_view_js",
			"CB_grid_view_js",
			"CB_activity_tracker_js",
			"CB_opportunity_js",
			"CB_sidebar_js",
			"CB_reports_js",
			"CB_js",
			"CB_account_detail_js",
				
			"CB_css"
		),
		
		"Pl2" => array(
			"Pl2_listview_template",
			"Pl2_taskinfo_template",
			"Pl2_accountinfo_template",
			"Pl2_contactinfo_template",
			"Pl2_keycontacts_template",
			"Pl2_leadinfo_template",
			"Pl2_relatedlist_template",
			"Pl2_inmail_template",
			"Pl2_conversations_template",
			"Pl2_add_task_template",
			"Pl2_nonSD_taskinfo_template",
				
			"Pl2_app_js",
			"Pl2_worker_js",
			"Pl2_utility_js",
			"Pl2_task_js",
			"Pl2_listview_js",
				
			"Pl2_app_css"
		),
			
		"Genie" => array(
			"Genie_view_as_template",
			"Genie_whatsnew_template",
			"Genie_header_template",
			"Genie_footer_template",
			"Genie_maintenance",
				
			"Genie_generic_js",
				
			"Genie_css"
		)
	);
	
	public static $RESOURCE_NAMES = array(
		"CB" => "CB_assets",
		"Pl2" => "Pl2_assets",
		"Genie" => "Genie_assets"
	);
	
	public function __construct(){	
	}
}
?>

