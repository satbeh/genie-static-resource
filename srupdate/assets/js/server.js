var https = require('https'),
	http = require('http'),
	express = require('express'),
	app = express(),
	path = require('path'),
	body_parser = require('body-parser'),
	sf = require('node-salesforce'),
	compressor = require('node-minify'),
	fs = require('fs'),
	archiver = require('archiver'),
	connection = {},
	hostname = '',
	filenames = { 
		CB :["CB_task_template","CB_create_add_on_template","CB_account_detail_template","CB_list_view_template","CB_grid_view_template","CB_contact_detail_template","CB_home_template","CB_dashboard_template","CB_charts_template","CB_90drenewals_template","CB_account_easybi_template","CB_playbook_email_template","CB_ltask_detail_template","CB_acchighlight_new_template","CB_acchighlight_renewal_template","CB_acchighlight_enterprise_template","CB_acchighlight_lss_template","CB_acchighlight_lssspc_template","CB_acchighlight_lms_template","CB_footer_template","CB_reports_template","CB_churnguard_template","CB_lss_retention_board_template","CB_other_js","CB_utility_js","CB_worker_js","CB_list_view_js","CB_grid_view_js","CB_activity_tracker_js","CB_opportunity_js","CB_sidebar_js","CB_reports_js","CB_js","CB_account_detail_js","CB_css"],
		Pl2 : ["Pl2_listview_template","Pl2_taskinfo_template","Pl2_accountinfo_template","Pl2_contactinfo_template","Pl2_keycontacts_template","Pl2_leadinfo_template","Pl2_relatedlist_template","Pl2_inmail_template","Pl2_conversations_template","Pl2_add_task_template","Pl2_nonSD_taskinfo_template","Pl2_app_js","Pl2_worker_js","Pl2_utility_js","Pl2_task_js","Pl2_listview_js","Pl2_app_css"],
		Genie : ["Genie_view_as_template","Genie_whatsnew_template","Genie_header_template","Genie_footer_template","Genie_maintenance","Genie_generic_js","Genie_css"]
	},
	resourcenames = {
		CB : "CB_assets",
		Pl2 : "Pl2_assets",
		Genie : "Genie_assets"
	};

app.use('/assets', express.static(__dirname + '/assets'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/login', function (req, res) {
	var org = req.body.org,
		uname = req.body.uname,
		pass = req.body.pass + req.body.access_token
		login_url = (org === 'sandbox') ? 'https://test.salesforce.com' : 'https://login.salesforce.com';
	
	connection = new sf.Connection({
		loginUrl: login_url
	});

	connection.login(uname, pass, function (login_err, info){
		if(login_err){
			res.format({
				'application/json': function(){
					res.send({ 'error': login_err.toString('utf8')});
				}
			});
			res.end('failure');
			return false;
		}

		hostname = connection.instanceUrl.replace(/.*?:\/\//g, "")
		var apex_pages = [];
		var req_ap = https.request({
			hostname: hostname,
			path: '/services/data/v28.0/query/?q=SELECT+Id,+Name+FROM+ApexPage+ORDER+BY+Name',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + connection.accessToken
			}
		}, function(response){
			response.setEncoding('utf8');
			response.on('data', function(data) {
				apex_pages += data || {};
			});

			response.on('end', function(){
				apex_pages = JSON.parse(apex_pages);
				res.send(apex_pages);
				res.end('success');
			});
		});
		req_ap.end();

		req_ap.on('error', function(e){
			res.format({
				'application/json': function(){
					res.send({ 'error': e.toString('utf8')});
				}
			});
			res.end('failure');
			return false;
		});
	});
});

app.get('/update_static_resources', function (req, res) {
	var resource_name = req.query.name,
		apex_files = filenames[resource_name],
		resource_fullname = resourcenames[resource_name]
		content = '';

	var req_vf = https.request({
			hostname: hostname,
			path: "/services/data/v34.0/query/?q=SELECT+Body+FROM+StaticResource+WHERE+Name+='" + resource_fullname + "'",
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + connection.accessToken
			}
		}, function (response){
			response.setEncoding('utf8');
			response.on('data', function(data) {
				content += data || {};
			});

			response.on('end', function(){
				
			});
		});
	req_vf.end();

	req_vf.on('error', function(e){
		res.format({
			'application/json': function(){
				res.send({ 'error': e.toString('utf8')});
			}
		});
		res.end('failure');
		return false;
	});
});

var script_js = path.join(__dirname + '/tmp/package/scripts.js'),
	script_min_js = path.join(__dirname + '/tmp/package/scripts.min.js'),
	style_css = path.join(__dirname + '/tmp/package/styles.css'),
	style_min_css = path.join(__dirname + '/tmp/package/styles.min.css'),
	templates = path.join(__dirname + '/tmp/package/templates');

app.post('/minify', function (req, res) {
	var apex_files = req.body.apex_files;
	if(typeof apex_files !== 'string' && apex_files.length > 40){
		res.format({
			'application/json': function(){
				res.send({ 'error': 'The application is under development and you cannot select more than 40 files at a time!'});
			}
		});
		res.end('failure');
		return false;
	}

	apex_files = typeof apex_files === 'string' ? [apex_files] : apex_files;

	var content = '',
		file_details = {html:[], css:[], js:[]},
		req_completed = 0,
		req_size = 0;
	
	var is_reqs_complete = function(){
		if(req_completed === req_size){
			res.send(file_details);
			res.end('success');
		}
	};
	
	var req_vf = https.request({
		hostname: hostname,
		path: '/services/data/v28.0/query/?q=SELECT+Name,+Markup+FROM+ApexPage+WHERE+Id+IN+(\'' + apex_files.join("','") + '\')',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + connection.accessToken
		}
	}, function (response){
		response.setEncoding('utf8');
		response.on('data', function(data) {
			content += data || {};
		});

		response.on('end', function(){
			content = JSON.parse(content);
			if(content.done){
				var records = content.records,
					tobe_written_js = '',
					tobe_written_css = '',
					review = '',
					pushed = '';

				for (var i=0; i<records.length; i++) {
					if(records[i]['Markup'].indexOf('contentType="application/javascript"') >= 0){
						file_details.js.push(records[i]['Name']);
						pushed = 'js';
					} else if(records[i]['Markup'].indexOf('contentType="text/css"') >= 0){
						file_details.css.push(records[i]['Name']);
						pushed = 'css';
					} else {
						pushed = 'html';
					}

					review = '';
					review = records[i]['Markup'];
					review = review.replace(/(<apex:page)(.*?)(>)/g, '');
					review = review.replace(/(<\/apex:page>)/g, '');

					if(pushed === 'js'){
						tobe_written_js += '\/\*\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-' +records[i]['Name']+ '\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\*\/ \n' + review + '\n';
					}
					else if(pushed === 'css'){
						review = review.replace(/(\{\!URLFOR\(\$Resource\.\w+\,\s+\')(.*?)(\'\)\})/g, '$2');
						tobe_written_css += '\/\*\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-' +records[i]['Name']+ '\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\*\/ \n' + review + '\n';
					} else {
						file_details.html.push({name: records[i]['Name'], markup: review});
					}
				}

				// write and compress the JavaScript content
				if(tobe_written_js !== '') {
					req_size++;
					fs.writeFileSync('tmp/package/scripts.js', tobe_written_js);
					new compressor.minify({
						type: 'gcc',
						fileIn: script_js,
						fileOut: script_min_js,
						callback: function(err, min){
							if(err){
								res.send(err.toString());
								res.end('failure');
							} else {
								req_completed++;
								is_reqs_complete();
							}
						}
					});
				}
				
				// write and compress the CSS content
				if(tobe_written_css !== ''){
					req_size++;
					fs.writeFileSync('tmp/package/styles.css', tobe_written_css);
					new compressor.minify({
						type: 'sqwish',
						fileIn: style_css,
						fileOut: style_min_css,
						callback: function (err, min) {
							if(err){
								res.send(err.toString());
								res.end('failure');
							} else {
								req_completed++;
								is_reqs_complete();
							}
						}
					});
				}

				//write the HTML content by dynamically creating the files
				if(file_details.html.length > 0){
					req_size++;
					var k=0;
					for(var i=0; i<file_details.html.length; i++){
						fs.writeFileSync('tmp/package/templates/'+file_details.html[i]['name']+'.html', file_details.html[i]['markup']);
						k++;
					}

					if(k===file_details.html.length){
						req_completed++;
						is_reqs_complete();
					}
				}

			} else {
				res.format({
					'application/json': function(){
						res.send({ 'error': content.toString('utf8')});
					}
				});
				res.end('failure');
				return false;
			}
		});
	});
	req_vf.end();

	req_vf.on('error', function(e){
		res.format({
			'application/json': function(){
				res.send({ 'error': e.toString('utf8')});
			}
		});
		res.end('failure');
		return false;
	});
});

app.get('/download', function (req, res) {
	var packaged = fs.createWriteStream(__dirname + '/tmp/package.zip');
	var archive = archiver('zip');

	packaged.on('close', function() {
	 	res.download(path.join(__dirname + '/tmp/package.zip'));

	 	//delete all files after download
	  	if(fs.existsSync(script_js)) fs.unlinkSync(script_js);
		if(fs.existsSync(script_min_js)) fs.unlinkSync(script_min_js);
		if(fs.existsSync(style_css)) fs.unlinkSync(style_css);
		if(fs.existsSync(style_min_css)) fs.unlinkSync(style_min_css);
		var partials = fs.readdirSync(templates);
		if(partials.length > 0){
			for (var i = 0; i < partials.length; i++) {
				var partials_path = templates + '/' + partials[i];
				if (fs.statSync(partials_path).isFile())
					fs.unlinkSync(partials_path);
			}
		}
	});

	archive.pipe(packaged);
	archive.bulk([
	  { 
	  	expand: true, 
	  	cwd: path.join(__dirname + '/tmp/package/'),
	  	src: ['*.js', '*.css', 'templates/*.html']
	  }
	]);
	archive.finalize();
});

app.listen(process.env.PORT || 8000, function() {
 	console.log('app listening');
});