<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SushiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'まぐろ', 'sort_order' => 1],
            ['name' => '白身・光り物', 'sort_order' => 2],
            ['name' => 'えび', 'sort_order' => 3],
            ['name' => 'サーモン', 'sort_order' => 4],
            ['name' => 'いか', 'sort_order' => 5],
            ['name' => '軍艦巻き', 'sort_order' => 6],
            ['name' => 'サイドメニュー', 'sort_order' => 7],
        ]);

        DB::table('products')->insert([
            ['name' => 'まぐろ', 'price' => 150, 'image_path' => 'images/products/maguro.png', 'category_id' => 1],
            ['name' => '本鮪中とろ', 'price' => 250, 'image_path' => 'images/products/chu_tro.png', 'category_id' => 1],
            ['name' => 'とろびんちょう', 'price' => 200, 'image_path' => 'images/products/toro_bincho.png', 'category_id' => 1],
            ['name' => '活〆はまち', 'price' => 200, 'image_path' => 'images/products/katu_hamachi.png', 'category_id' => 2],
            ['name' => '活〆まだい', 'price' => 200, 'image_path' => 'images/products/katu_madai.png', 'category_id' => 2],
            ['name' => 'しめさば', 'price' => 200, 'image_path' => 'images/products/sime_sama.png', 'category_id' => 2],
            ['name' => 'サーモン', 'price' => 200, 'image_path' => 'images/products/salmon.png', 'category_id' => 4],
            ['name' => '焼とろサーモン', 'price' => 200, 'image_path' => 'images/products/yaki_toro_salmon.png', 'category_id' => 4],
            ['name' => 'いくら', 'price' => 260, 'image_path' => 'images/products/ikura.png', 'category_id' => 6],
            ['name' => 'うに軍艦', 'price' => 360, 'image_path' => 'images/products/uni.png', 'category_id' => 6],
            ['name' => 'えび', 'price' => 160, 'image_path' => 'images/products/ebi.png', 'category_id' => 3],
            ['name' => '甘えび', 'price' => 160, 'image_path' => 'images/products/ama_ebi.png', 'category_id' => 3],
            ['name' => 'アカイカ', 'price' => 160, 'image_path' => 'images/products/aka_ika.png', 'category_id' => 5],
            ['name' => 'かつおだしの茶碗蒸し', 'price' => 300, 'image_path' => 'images/products/tyawan_musi.png', 'category_id' => 7],
            ['name' => 'あおさみそ汁', 'price' => 150, 'image_path' => 'images/products/aosa_misosiru.png', 'category_id' => 7],
            ['name' => 'カリカリポテト', 'price' => 280, 'image_path' => 'images/products/kari_poteto.png', 'category_id' => 7],
        ]);

        $seats = [];
        for ($i = 1; $i <= 10; $i++) {
            $seats[] = ['number' => $i];
        }

        DB::table('seats')->insert($seats);
    }
}
