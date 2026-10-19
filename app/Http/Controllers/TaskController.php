<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {   
        $query = $request->validate(['query' => ['nullable', 'string', 'max:255']])['query'] ?? null;
        $tasks = auth()->user()->tasks();
        if($query !== null && $query !== '') {
            $tasks = $tasks->where('title', 'like', "%{$query}%")->orWhere('description', 'like', "%{$query}%")->orWhere('status', 'like', "%{$query}%");
        }
        $tasks = $tasks->orderBy('created_at', 'desc')->paginate(5)->withQueryString();

        return inertia('Tasks/Tasks', [
            'tasks' => $tasks,
            'query' => $query,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return inertia('Tasks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = auth()->user()->tasks()->create($request->validated());
        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $task = auth()->user()->tasks()->findOrFail($id);
        return inertia('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $task = auth()->user()->tasks()->findOrFail($id);
        return inertia('Tasks/Create', [
            'task' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTaskRequest $request, int $id)
    {
        $task = auth()->user()->tasks()->findOrFail($id);
        $task->update($request->validated());
        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = auth()->user()->tasks()->findOrFail($id);
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
