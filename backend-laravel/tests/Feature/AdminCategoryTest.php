<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_page_displays_categories(): void
    {
        Category::query()->create([
            'name' => 'まぐろ',
            'sort_order' => 1,
        ]);

        $response = $this->get(route('admin.category.index'));

        $response
            ->assertOk()
            ->assertSee('カテゴリ一覧')
            ->assertSee('まぐろ');
    }

    public function test_create_page_displays_next_sort_order(): void
    {
        Category::query()->create([
            'name' => '既存カテゴリ',
            'sort_order' => 7,
        ]);

        $response = $this->get(route('admin.category.create'));

        $response
            ->assertOk()
            ->assertSee('カテゴリ登録')
            ->assertSee('value="8"', false);
    }

    public function test_store_creates_category_and_redirects(): void
    {
        $response = $this->post(route('admin.category.store'), [
            'name' => '新規カテゴリ',
            'sort_order' => 9,
        ]);

        $response->assertRedirect(route('admin.category.index'));

        $this->assertDatabaseHas('categories', [
            'name' => '新規カテゴリ',
            'sort_order' => 9,
        ]);
    }

    public function test_update_changes_category_and_redirects(): void
    {
        $category = Category::query()->create([
            'name' => '旧カテゴリ',
            'sort_order' => 2,
        ]);

        $response = $this->post(route('admin.category.update', $category), [
            'name' => '更新カテゴリ',
            'sort_order' => 5,
        ]);

        $response->assertRedirect(route('admin.category.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => '更新カテゴリ',
            'sort_order' => 5,
        ]);
    }

    public function test_delete_removes_category_and_redirects(): void
    {
        $category = Category::query()->create([
            'name' => '削除カテゴリ',
            'sort_order' => 4,
        ]);

        $response = $this->post(route('admin.category.destroy', $category));

        $response->assertRedirect(route('admin.category.index'));
        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
