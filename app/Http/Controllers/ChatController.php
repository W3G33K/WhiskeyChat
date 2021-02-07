<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Illuminate\Http\Response;
	use Illuminate\Http\Request;

	class ChatController extends Controller {
		/**
		 * Display a listing of the resource.
		 *
		 * @return Response
		 */
		public function index(): Response {
			return new Response('ChatController@index');
		}

		/**
		 * Show the form for creating a new resource.
		 *
		 * @return Response
		 */
		public function create(): Response {
			return new Response('ChatController@create');
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param Request $request
		 * @return Response
		 */
		public function store(Request $request): Response {
			return new Response('ChatController@store');
		}

		/**
		 * Display the specified resource.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function show(User $user): Response {
			return new Response('ChatController@show');
		}

		/**
		 * Show the form for editing the specified resource.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function edit(User $user): Response {
			return new Response('ChatController@edit');
		}

		/**
		 * Update the specified resource in storage.
		 *
		 * @param Request $request
		 * @param User $user
		 * @return Response
		 */
		public function update(Request $request, User $user): Response {
			return new Response('ChatController@update');
		}

		/**
		 * Remove the specified resource from storage.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function destroy(User $user): Response {
			return new Response('ChatController@destroy');
		}
	}
