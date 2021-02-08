@extends('layouts.app')

@section('header')
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
@endsection

@section('content')
	<div class="flex-fill">
		<section class="messages">
			<ul class="idfk-hehe">&nbsp;</ul>
		</section>
	</div>
@endsection

@section('footer')
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
@endsection

@section('body-scripts')
	<script type="text/javascript" src="{{ asset('js/pages/chat.js') }}"></script>
@endsection
