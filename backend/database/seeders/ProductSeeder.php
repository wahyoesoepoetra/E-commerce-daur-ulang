<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
      $botolId = DB::table('categories')
        ->where('category', 'Botol Plastik')
        ->value('category_id');

    $kerajinanId = DB::table('categories')
        ->where('category', 'Kerajinan Daur Ulang')
        ->value('category_id');

    $aksesoriId = DB::table('categories')
        ->where('category', 'Aksesori')
        ->value('category_id');

    DB::table('products')->insert([
        [
            'name' => 'Pot Tanaman dari Botol',
            'description' => 'Pot tanaman yang dibuat dari botol plastik bekas.',
            'category_id' => $botolId,
            'price' => 15000,
            'img' => null,
            'stock' => 20,
            'slug' => 'pot-tanaman-dari-botol',
        ],
        [
            'name' => 'Tempat Pensil Daur Ulang',
            'description' => 'Tempat pensil dari bahan plastik daur ulang.',
            'category_id' => $kerajinanId,
            'price' => 12000,
            'img' => null,
            'stock' => 15,
            'slug' => 'tempat-pensil-daur-ulang',
        ],
        [
            'name' => 'Gantungan Kunci Plastik',
            'description' => 'Gantungan kunci unik dari plastik bekas.',
            'category_id' => $aksesoriId,
            'price' => 5000,
            'img' => null,
            'stock' => 30,
            'slug' => 'gantungan-kunci-plastik',
        ],
        ]);
    }
}