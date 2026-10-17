<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
                'max:5000',
            ],

            'status' => [
                'required',
                Rule::in([
                    'pending',
                    'in_progress',
                    'completed',
                ]),
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:today',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a task title.',
            'title.max' => 'The title cannot exceed 255 characters.',
            'description.required' => 'The description is required.',
            'description.max' => 'The description cannot exceed 5000 characters.',
            'status.in' => 'Please select a valid task status.',
        ];
    }
}
