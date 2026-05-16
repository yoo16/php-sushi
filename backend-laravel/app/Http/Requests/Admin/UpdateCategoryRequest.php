<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:categories,id'],
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('categories', 'name')->ignore((int) $this->input('id')),
            ],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
