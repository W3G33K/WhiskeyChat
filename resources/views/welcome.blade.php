@extends('layouts.app')

@section('content')
	<div class="container m-md-auto mx-sm-auto my-3">
		<section class="card">
			<header class="card-header p-3">
				<h1 class="font-weight-bolder m-0 pb-1 text-center text-dark shadow-lg small">
					{{ config('app.name', 'WhiskeyChat') }}
				</h1>
				<div class="mt-n4 text-right buttons">
					<i class="text-center button maximize"></i>
					<i class="text-center button minimize"></i>
					<i class="text-center button close-button"></i>
				</div>
			</header>

			<div class="card-body">
				<div class="card-title">
					<h5>Hi-diddly-ho there, strangerino!</h5>
				</div>
				<div class="card-text">
					<h6>Welcome to {{ config('app.name', 'WhiskeyChat') }}!</h6>
					<p>&horbar; A(n) app for sophisticated communication app between sophisticated lads and lasses.</p>
					<p>
						Kick back, take a swig of your favorite bourbon <em>(or scotch)</em>,
						and put your thinking cap on. Imagine a sophisticated nickname,
						and choose anything you like that is within the rules listed below. You
						will always be able to change your nickname at anytime. Please enter
						whatever you've chosen into the text box down below and press "Join Chat"
						button.
					</p>
					<ol class="font-weight-lighter small">
						<li>Your nickname must be at least 3 characters long but cannot be longer than 24 characters.</li>
						<li>Your nickname must be alphanumeric consisting of only letters, numbers, dots and underscores.</li>
						<li>
							Please be sophisticated with your choice. Don't pick a nickname
							that could be considered as offending or harassment.
						</li>
					</ol>
					<p id="suggested-nickname" class="font-weight-lighter text-muted text-right small">
						<em>
							(e.g. &quot;<a href="#suggested-nickname">{{ $placeholder }}</a>&quot; works)
						</em>
					</p>
					@if ($errors->any())
						<div class="alert alert-danger">
							<ul>
								@foreach ($errors->all() as $error)
									<li>{{ $error }}</li>
								@endforeach
							</ul>
						</div>
					@endif
					<form action="{{ route('join') }}" method="post">
						@csrf
						<div class="form-group">
							<label for="nickname">Your nickname</label>
							<em id="interactive-error"
								class="d-block d-sm-inline font-weight-lighter text-danger small">&nbsp;</em>
							<input type="text" id="nickname" name="nickname"
								   class="form-control form-control-lg" value="{{ old('nickname') }}"
								   required minlength="3" maxlength="24" pattern="^[\w\._]+$"/>
							<p id="sizeof-nickname" class="font-weight-light small">&nbsp;</p>
						</div>
						<div class="form-group">
							<button type="submit" class="btn btn-primary">Join Chat</button>
						</div>
					</form>
				</div>
			</div>

			<footer class="card-footer bg-light-gray p-3 text-muted text-center small">
				<p class="m-0">
					Copyright &copy; @copyright_datetime <a href="https://github.com/W3G33K">Ryan K. Clark</a>
				</p>
			</footer>
		</section>
	</div>
@endsection

@section('body-scripts')
	<script type="text/javascript" src="{{ asset('js/pages/user.js') }}"></script>
@endsection
