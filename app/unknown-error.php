<!DOCTYPE html>
<html lang="en" style="height: 100%;">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<meta name="description" content="Academic planning for UC Davis">
	<meta name="author" content="UC Davis Division of Social Science IT Development Team">

	<title>Instructional Planning and Administration</title>

	<link rel="stylesheet" type="text/css" href="/css/lib.css" />

</head>

<body style="background-color: rgb(238, 238, 238);">
	<div class="jumbotron" style="text-align: center; height: 100%;">
		<h1>Uh oh.</h1>
		<p class="lead">We encountered an error we were not prepared for.</p>

		<?php
			$body = "Date: " . date(DATE_RFC2822) . "\r\n\r\nRequest headers:\r\n\r\n";

			foreach (getallheaders() as $name => $value) {
				$body .= "\t$name: $value\n";
			}

			$headers = 'From: no-reply@ipa.ucdavis.edu' . "\r\n" .
    				'Reply-To: no-reply@ipa.ucdavis.edu' . "\r\n" .
    				'X-Mailer: PHP/' . phpversion();

			if(mail ( "dssit-devs-exceptions@ucdavis.edu", "IPA Uh Oh Page Request", $body, $headers ) == false) {
				/* Nothing we can do. */
			}
		?>

		<p class="lead"><br />Please <a href="https://it.dss.ucdavis.edu/">report this to IT</a>.</p>
	</div>
</body>
