<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Genie Static Resources</title>
    <meta name="description" content="Genie Static Resources - updates the genie static resources with the latest code." />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
</head>

<body>
<div class="container">	
	<div class="row">		
		<div class="col-md-6 col-md-offset-3">
			<div class="row">		
				<div class="col-md-10">
					<h3> Genie Static Resources </h3>
				</div>
				<div class="col-md-2">
				<?php if($appController->sforceLoginController->isLoggedIn()) { ?>
					<form action="" method="POST">	
						<button type="submit" name="logout" class="btn btn-danger btn-xs pull-right" style="margin-top:20px">Logout</button>
					</form>
				<?php } ?>
				</div>
			</div>
			
			
			