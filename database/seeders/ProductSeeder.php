<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductTranslation;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data - disable foreign key checks first
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ProductTranslation::truncate();
        Product::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $faker = Faker::create('en_MY');

        $vendors = [
            'Blackmores', 'Cetaphil', 'Abbott', 'Nestlé', 'Anlene',
            'Scott\'s', 'Appeton', 'Biogesic', 'Panadol', 'Gaviscon',
            'Loreal', 'Garnier', 'Neutrogena', 'Nivea', 'Vaseline',
            'Durex', 'Sensodyne', 'Colgate', 'Oral-B', 'Listerine',
        ];

        $categories = [
            'Vitamins & Supplements', 'Skincare', 'Nutrition',
            'Personal Care', 'Baby Care', 'Oral Care', 'Hair Care',
            'Pain Relief', 'Cold & Flu', 'Digestive Health',
        ];

        $imagePool = [
            'product-placeholder-1.jpg',
            'product-placeholder-2.jpg',
            'product-placeholder-3.jpg',
            'product-placeholder-4.jpg',
            'product-placeholder-5.jpg',
        ];

        $statuses = ['Active', 'Active', 'Active', 'Inactive']; // 75% Active

        for ($i = 1; $i <= 100; $i++) {
            $vendor = $faker->randomElement($vendors);
            $category = $faker->randomElement($categories);
            $basePrice = $faker->randomFloat(2, 5.90, 199.90);
            $retailPrice = round($basePrice * $faker->randomFloat(2, 1.0, 1.3), 2);
            $skuCode = strtoupper($faker->bothify('???-###-???-###'));
            $barcode = $faker->ean13();
            $weight = $faker->randomFloat(4, 0.05, 2.5);
            $productSlug = $faker->unique()->slug(4);
            $productNameEN = $vendor . ' ' . $faker->words(3, true);

            $product = Product::create([
                'product_sku' => $skuCode,
                'product_barcode' => $barcode,
                'product_vendor' => $vendor,
                'product_price' => $basePrice,
                'product_retail_price' => $retailPrice,
                'product_weight' => $weight,
                'product_image' => $faker->randomElement($imagePool),
                'product_status' => $faker->randomElement($statuses),
                'product_friendly_url' => $productSlug,
            ]);

            // English translation
            ProductTranslation::create([
                'products_id' => $product->products_id,
                'product_name' => ucwords($productNameEN),
                'product_description' => $faker->paragraph(3),
                'product_meta_title' => ucwords($productNameEN) . ' | ' . $category,
                'product_meta_description' => $faker->sentence(15),
                'language_code' => 'en-MY',
            ]);

            // Malay translation
            ProductTranslation::create([
                'products_id' => $product->products_id,
                'product_name' => ucwords($productNameEN),
                'product_description' => $faker->paragraph(3),
                'product_meta_title' => ucwords($productNameEN) . ' | ' . $category,
                'product_meta_description' => $faker->sentence(15),
                'language_code' => 'ms-MY',
            ]);

            // Chinese translation
            ProductTranslation::create([
                'products_id' => $product->products_id,
                'product_name' => ucwords($productNameEN),
                'product_description' => $faker->paragraph(3),
                'product_meta_title' => ucwords($productNameEN) . ' | ' . $category,
                'product_meta_description' => $faker->sentence(15),
                'language_code' => 'zh-CN',
            ]);
        }

        $this->command->info('100 products seeded successfully!');
    }
}
