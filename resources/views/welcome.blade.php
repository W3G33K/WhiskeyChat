<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset="UTF-8"/>
		<meta name="author" content="Ryan K. Clark [W3Geek]"/>
		<meta name="description" content="Instant messaging for sophisticated gentlemen."/>
		<meta name="csrf-token" content="{{ csrf_token() }}"/>
		<meta name="viewport" content="width=device-width,initial-scale=1.0"/>

		<title>99 Unread Messages :: {{ config('app.name', 'WhiskeyChat') }}</title>

		<!-- Stylesheets -->
		<link type="text/css" rel="stylesheet" href="{{ asset('css/app.css') }}"/>
	</head>

	<body class="d-none">
		<main class="d-flex flex-column min-vh-100">
			<header class="container-fluid fixed-top top_menu">
				<section class="row">
					<h1 class="col font-weight-bolder m-0 text-center small">
						{{ config('app.name', 'WhiskeyChat') }}
					</h1>
				</section>
				<section class="row">
					<div class="col mt-n4 shadow-sm text-right buttons">
						<i class="text-center button maximize"></i>
						<i class="text-center button minimize"></i>
						<i class="text-center button close-button"></i>
					</div>
				</section>
				<section class="row">
					<div class="col subtitle font-weight-light text-center text-sm-right">
						<i class="icon user-icon"></i>
						99 Users Online
					</div>
				</section>
			</header>

			<section class="flex-fill messages">
				<ul class="idk">&nbsp;</ul>
			</section>

			<footer class="container-fluid bg-white fixed-bottom footer">
				<section class="row">
					<div class="col-sm-12 col-md pr-md-0">
						<div class="form-group">
							<label for="message_input" class="d-none hide">Message Input</label>
							<input type="text" id="message_input" name="message_input"
								   class="form-control" placeholder="Type your message here..."/>
						</div>
					</div>
					<div class="col-2 col-xl-1 d-none d-md-block">
						<div class="form-group">
							<button class="btn btn-block btn-primary font-weight-lighter">Send</button>
						</div>
					</div>
				</section>
			</footer>
		</main>

		<!-- Scripts -->
		@env('local', 'testing')
			<script type="text/javascript">
				window.whiskey = Object.assign({
					debug: function(target, callback) {
						console.info('Invoking debug target:', target);
						if (typeof callback !== 'function') {
							throw new TypeError('Callback function was expected but not received.');
						}

						try {
							console.time(target);
							callback.call(this, target);
							console.timeLog(target, 'Invocation on debug target completed successfully.');
						} catch (e) {
							console.error('Invocation on debug target failed with error message:', e.message);
							throw e;
						} finally {
							console.timeEnd(target);
						}
					}
				}, window.whiskey);
			</script>
		@endenv

		<script type="text/template" id="message-template">
			<li class="message">
				<div class="avatar">
					<i class="online-icon text-right"></i>
				</div>

				<div class="text_wrapper">
					<div class="text">
						Programming is like sex: One mistake and you have to support it for the rest of your life.
					</div>
				</div>
			</li>
		</script>

		<script type="text/template" id="alert-template">
			<div class="modal fade" role="dialog" tabindex="-1">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<header class="modal-header">
							<h5 class="modal-title">{{ config('app.name', 'WhiskeyChat') }}</h5>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true">&times;</span>
							</button>
						</header>

						<div class="modal-body">
							<blockquote>
								<q>
									Ninety-nine bugs in the code,
									ninety-nine bugs.
									Take one down, patch it around,
									One-hundred bugs in the code.
								</q>
								<span class="prefix-emdash">Unknown</span>
							</blockquote>
						</div>

						<footer class="modal-footer">
							<button type="button" class="btn btn-primary modal-accept"
									data-dismiss="modal">OK</button>
						</footer>
					</div>
				</div>
			</div>
		</script>

		<script type="text/template" id="prompt-template">
			<div class="modal fade" role="dialog" tabindex="-1">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<header class="modal-header">
							<h5 class="modal-title">{{ config('app.name', 'WhiskeyChat') }}</h5>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true">&times;</span>
							</button>
						</header>

						<div class="modal-body">
							<div class="form-group">
								<label for="nickname">Nickname</label>
								<input type="text" id="nickname" name="nickname"
									   class="form-control" placeholder="W3Geek"/>
							</div>
						</div>

						<footer class="modal-footer">
							<button type="button" class="btn btn-primary modal-accept"
									data-dismiss="modal">OK</button>
						</footer>
					</div>
				</div>
			</div>
		</script>

		<script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
		<script type="text/javascript" src="{{ asset('js/pages/chat.js') }}"></script>
		<script type="text/javascript" src="{{ asset('js/kickoff.js') }}"></script>
	</body>
</html>
