<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Route;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'pageTitle' => $this->getPageTitle(),
        ];
    }

    protected function getPageTitle(): string
    {
        $routeName = Route::currentRouteName();

        // 1. Static Route Names Mapping
        $titles = [
            'dashboard'    => 'Dashboard',
            'profile.edit'=> 'Account Settings',
            'tasks.index'  => 'Manage Tasks',
            'tasks.create' => 'Create Task',
            'tasks.show'   => 'Task Details',
            'tasks.edit'   => 'Edit Task',
        ];

        if (isset($titles[$routeName])) {
            return $titles[$routeName];
        }

        // 2. Fallback: Automatically prettify route names (e.g., "about-us" -> "About Us")
        if ($routeName) {
            return ucwords(str_replace(['.', '-', '_'], ' ', $routeName));
        }

        return '';
    }
}
