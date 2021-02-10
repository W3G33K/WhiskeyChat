@extends('layouts.app')

@section('header')
	<header class="container-fluid bg-light fixed-top p-3 menubar shadow">
		<section class="row">
			<h1 class="col font-weight-bolder m-0 pb-1 text-center shadow-sm small">
				{{ config('app.name', 'WhiskeyChat') }}
			</h1>
		</section>
		<section class="row">
			<div class="col mt-n4 text-right buttons">
				<i class="text-center button maximize"></i>
				<i class="text-center button minimize"></i>
				<i class="text-center button close-button"></i>
			</div>
		</section>
		<section class="row">
			<div class="col subtitle font-weight-light text-center text-sm-right">
				<i class="icon user-icon"></i>
				<a href="#list-participants" title="List Participants" id="list-participants">&nbsp;</a>
			</div>
		</section>
	</header>
@endsection

@section('content')
	<div class="container-fluid messages">
		<section class="mt-5 py-5">
			<ul id="message-pane" class="pl-2">&nbsp;</ul>
		</section>
	</div>
@endsection

@section('footer')
	<footer class="container-fluid bg-white fixed-bottom footer">
		<section class="row">
			<div class="col-sm-12 col-md pr-md-0">
				<div class="form-group">
					<label for="message" class="d-none hide">Message Input</label>
					<input type="text" id="message" name="message"
						   class="form-control" placeholder="{{ $participant['nickname'] }}: Say hello to your fellows ..."/>
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

@section('hidden')
	<input type="hidden" id="room-id" name="room-id"
		   value="1" disabled readonly/>
	<input type="hidden" id="participant-id" name="participant-id"
		   value="{{ $participant['id'] }}" disabled readonly/>
	<input type="hidden" id="participant-nickname" name="participant-nickname"
		   value="{{ $participant['nickname'] }}" disabled readonly/>
	<input type="hidden" id="participant-type" name="participant-type"
		   value="{{ $participant['type'] }}" disabled readonly/>
@endsection

@section('dom-templates')
	<script type="text/template" id="participants-template">
		<div class="modal fade" role="dialog" tabindex="-1">
			<div class="modal-dialog modal-dialog-scrollable" role="document">
				<div class="modal-content">
					<header class="modal-header">
						<h5 class="modal-title">Users Online</h5>
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
							<span class="prefix-emdash">W3Geek</span>
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
@endsection

@section('body-scripts')
	<script type="text/javascript" src="{{ mix('js/pages/chat.js') }}"></script>
@endsection
