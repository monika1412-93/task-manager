<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_task(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('tasks.store'), [
            'title' => 'Complete assignment',
            'description' => 'Finish the Codzee evaluation',
            'status' => 'pending',
            'due_date' => now()->addDays(2)->toDateString(),
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'title' => 'Complete assignment',
            'status' => 'pending',
        ]);
    }

    public function test_task_creation_requires_a_title(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('tasks.store'), [
            'title' => '',
            'description' => 'Some description',
            'status' => 'pending',
            'due_date' => null,
        ]);

        $response->assertSessionHasErrors('title');
    }

    public function test_user_cannot_view_another_users_task(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $anotherUser->id,
        ]);

        $this->actingAs($user)
            ->get(route('tasks.show', $task))
            ->assertForbidden();
    }

    public function test_user_cannot_edit_another_users_task(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $anotherUser->id,
        ]);

        $this->actingAs($user)
            ->get(route('tasks.edit', $task))
            ->assertForbidden();
    }

    public function test_user_cannot_update_another_users_task(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $anotherUser->id,
            'title' => 'Original task',
        ]);

        $this->actingAs($user)
            ->put(route('tasks.update', $task), [
                'title' => 'Modified by another user',
                'description' => 'Unauthorized change',
                'status' => 'pending',
                'due_date' => now()->addDays(3)->toDateString(),
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Original task',
            'user_id' => $anotherUser->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_task(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $anotherUser->id,
        ]);

        $this->actingAs($user)
            ->delete(route('tasks.destroy', $task))
            ->assertForbidden();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'user_id' => $anotherUser->id,
        ]);
    }

}