<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<meta name="author" content="Ryan Clark"/>
		<meta name="description" content="Sophisticated communication for sophisticated lads &amp; lasses."/>
		<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
		<meta name="csrf-token" content="{{ csrf_token() }}"/>
		@yield('additional-metadata')

		<title>{{ config('app.name', 'WhiskeyChat') }}</title>

		<link rel="shortcut icon" href="{{ asset('favicon.ico') }}"/>

		<!-- Page Scripts: -->
		@yield('page-scripts')

		<!-- Page Stylesheets: -->
		@yield('page-stylesheets')
		<link type="text/css" rel="stylesheet" href="{{ mix('css/app.css') }}"/>
		@yield('override-stylesheets')
	</head>

	<body class="bg-dark invisible">
		<main class="d-flex flex-column min-vh-100">
			@yield('header')
			@yield('content')
			@yield('footer')
			<div class="d-none hide invisible">
				@yield('hidden')
			</div>
		</main>

		<!-- DOM Templates: -->
		@yield('dom-templates')

		<!-- Body Scripts: -->
		<script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
		@yield('body-scripts')
	</body>
</html>
