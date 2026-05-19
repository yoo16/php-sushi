<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSeatRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $seat = $this->route('seat');

        $this->merge([
            'id' => is_object($seat) ? $seat->id : $seat,
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:seats,id'],
            'number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('seats', 'number')->ignore((int) $this->input('id')),
            ],
        ];
    }
}
