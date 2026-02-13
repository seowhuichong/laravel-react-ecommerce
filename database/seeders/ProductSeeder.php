<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductTranslation;

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

        // Create sample products
        $products = [
            [
                'product' => [
                    'product_sku' => 'BLK-VIT-C-500',
                    'product_barcode' => '9310160811080',
                    'product_vendor' => 'Blackmores',
                    'product_price' => 45.90,
                    'product_retail_price' => 59.90,
                    'product_weight' => 0.2500,
                    'product_image' => 'blackmores-vitamin-c.jpg',
                    'product_status' => 'Active',
                    'product_friendly_url' => 'blackmores-vitamin-c-500mg',
                ],
                'translations' => [
                    [
                        'product_name' => 'Blackmores Vitamin C 500mg',
                        'product_description' => 'Blackmores Vitamin C 500mg provides immune system support and helps reduce free radical damage to body cells.',
                        'product_meta_title' => 'Blackmores Vitamin C 500mg | Immune Support',
                        'product_meta_description' => 'Buy Blackmores Vitamin C 500mg online. Supports immune health and antioxidant protection.',
                        'language_code' => 'en-MY',
                    ],
                    [
                        'product_name' => 'Blackmores Vitamin C 500mg',
                        'product_description' => 'Blackmores Vitamin C 500mg menyediakan sokongan sistem imun dan membantu mengurangkan kerosakan radikal bebas kepada sel badan.',
                        'product_meta_title' => 'Blackmores Vitamin C 500mg | Sokongan Imun',
                        'product_meta_description' => 'Beli Blackmores Vitamin C 500mg dalam talian. Menyokong kesihatan imun dan perlindungan antioksidan.',
                        'language_code' => 'ms-MY',
                    ],
                    [
                        'product_name' => 'Blackmores 维生素C 500毫克',
                        'product_description' => 'Blackmores 维生素C 500毫克提供免疫系统支持，帮助减少自由基对身体细胞的损害。',
                        'product_meta_title' => 'Blackmores 维生素C 500毫克 | 免疫支持',
                        'product_meta_description' => '在线购买Blackmores维生素C 500毫克。支持免疫健康和抗氧化保护。',
                        'language_code' => 'zh-CN',
                    ],
                ],
            ],
            [
                'product' => [
                    'product_sku' => 'CTP-GNT-CLN-500',
                    'product_barcode' => '3499320000444',
                    'product_vendor' => 'Cetaphil',
                    'product_price' => 38.50,
                    'product_retail_price' => 38.50,
                    'product_weight' => 0.5500,
                    'product_image' => 'cetaphil-gentle-cleanser.jpg',
                    'product_status' => 'Active',
                    'product_friendly_url' => 'cetaphil-gentle-skin-cleanser-500ml',
                ],
                'translations' => [
                    [
                        'product_name' => 'Cetaphil Gentle Skin Cleanser 500ml',
                        'product_description' => 'A mild, soap-free formula that cleans without irritation. Ideal for sensitive skin.',
                        'product_meta_title' => 'Cetaphil Gentle Skin Cleanser 500ml',
                        'product_meta_description' => 'Gentle cleanser for all skin types. Non-irritating and soap-free formula.',
                        'language_code' => 'en-MY',
                    ],
                    [
                        'product_name' => 'Cetaphil Pembersih Kulit Lembut 500ml',
                        'product_description' => 'Formula lembut tanpa sabun yang membersihkan tanpa kerengsaan. Sesuai untuk kulit sensitif.',
                        'product_meta_title' => 'Cetaphil Pembersih Kulit Lembut 500ml',
                        'product_meta_description' => 'Pembersih lembut untuk semua jenis kulit. Formula tanpa kerengsaan dan tanpa sabun.',
                        'language_code' => 'ms-MY',
                    ],
                    [
                        'product_name' => 'Cetaphil 温和洁肤乳 500毫升',
                        'product_description' => '温和的无皂配方，清洁而不刺激。适合敏感肌肤。',
                        'product_meta_title' => 'Cetaphil 温和洁肤乳 500毫升',
                        'product_meta_description' => '适合所有肤质的温和洁面乳。无刺激无皂配方。',
                        'language_code' => 'zh-CN',
                    ],
                ],
            ],
            [
                'product' => [
                    'product_sku' => 'ENS-GLD-VAN-850',
                    'product_barcode' => '8852756400011',
                    'product_vendor' => 'Abbott',
                    'product_price' => 52.90,
                    'product_retail_price' => 65.90,
                    'product_weight' => 0.8500,
                    'product_image' => 'ensure-gold-vanilla.jpg',
                    'product_status' => 'Active',
                    'product_friendly_url' => 'ensure-gold-vanilla-850g',
                ],
                'translations' => [
                    [
                        'product_name' => 'Ensure Gold Vanilla 850g',
                        'product_description' => 'Complete and balanced nutrition with HMB to help maintain muscle mass. Suitable for adults.',
                        'product_meta_title' => 'Ensure Gold Vanilla 850g | Complete Nutrition',
                        'product_meta_description' => 'Buy Ensure Gold Vanilla 850g. Complete nutrition with HMB for muscle health.',
                        'language_code' => 'en-MY',
                    ],
                    [
                        'product_name' => 'Ensure Gold Vanila 850g',
                        'product_description' => 'Nutrisi lengkap dan seimbang dengan HMB untuk membantu mengekalkan jisim otot. Sesuai untuk orang dewasa.',
                        'product_meta_title' => 'Ensure Gold Vanila 850g | Nutrisi Lengkap',
                        'product_meta_description' => 'Beli Ensure Gold Vanila 850g. Nutrisi lengkap dengan HMB untuk kesihatan otot.',
                        'language_code' => 'ms-MY',
                    ],
                    [
                        'product_name' => 'Ensure Gold 香草味 850克',
                        'product_description' => '含HMB的完整均衡营养，有助于维持肌肉质量。适合成人。',
                        'product_meta_title' => 'Ensure Gold 香草味 850克 | 完整营养',
                        'product_meta_description' => '购买Ensure Gold香草味850克。含HMB的完整营养，促进肌肉健康。',
                        'language_code' => 'zh-CN',
                    ],
                ],
            ],
        ];

        foreach ($products as $data) {
            // Create product
            $product = Product::create($data['product']);

            // Create translations
            foreach ($data['translations'] as $translation) {
                ProductTranslation::create([
                    'products_id' => $product->products_id,
                    'product_name' => $translation['product_name'],
                    'product_description' => $translation['product_description'],
                    'product_meta_title' => $translation['product_meta_title'],
                    'product_meta_description' => $translation['product_meta_description'],
                    'language_code' => $translation['language_code'],
                ]);
            }
        }

        $this->command->info('Products seeded successfully!');
    }
}
