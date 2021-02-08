<?php

	namespace App\Providers;

	use Illuminate\Support\Facades\Blade;
	use Illuminate\Support\ServiceProvider;

	class AppServiceProvider extends ServiceProvider {
		/**
		 * Register any application services.
		 *
		 * @return void
		 */
		public function register(): void {
			$this->app->singleton('deployment-version', function(): string {
				$filePath = base_path('./composer.json');
				$deploymentFile = file_get_contents($filePath);
				$deploymentJson = json_decode($deploymentFile);
				return ($deploymentJson->version ?? '1.0.0');
			});
		}

		/**
		 * Bootstrap any application services.
		 *
		 * @return void
		 */
		public function boot(): void {
			Blade::directive('app_version', function(): string {
				return app('deployment-version');
			});

			Blade::directive('copyright_datetime', function(): string {
				return date('Y');
			});
		}
	}
