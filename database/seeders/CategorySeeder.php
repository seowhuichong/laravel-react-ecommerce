<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryTranslation;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $tree = [
            [
                'slug' => 'supplement',
                'sort' => 0,
                'names' => ['en-MY' => 'Supplement', 'ms-MY' => 'Suplemen', 'zh-CN' => '营养补充品'],
                'children' => [
                    [
                        'slug' => 'bone-joint',
                        'sort' => 0,
                        'names' => ['en-MY' => 'Bone & Joint Support', 'ms-MY' => 'Tulang & Sendi', 'zh-CN' => '骨骼关节'],
                        'children' => [
                            ['slug' => 'calcium', 'sort' => 0, 'names' => ['en-MY' => 'Calcium', 'ms-MY' => 'Kalsium', 'zh-CN' => '钙片'], 'children' => []],
                            ['slug' => 'glucosamine', 'sort' => 1, 'names' => ['en-MY' => 'Glucosamine', 'ms-MY' => 'Glukosamin', 'zh-CN' => '氨糖'], 'children' => []],
                        ]
                    ],
                    ['slug' => 'brain-memory', 'sort' => 1, 'names' => ['en-MY' => 'Brain & Memory', 'ms-MY' => 'Otak & Memori', 'zh-CN' => '脑力记忆'], 'children' => []],
                    ['slug' => 'digestive-care', 'sort' => 2, 'names' => ['en-MY' => 'Digestive Care', 'ms-MY' => 'Kesihatan Penghadaman', 'zh-CN' => '消化护理'], 'children' => []],
                    ['slug' => 'immunity', 'sort' => 3, 'names' => ['en-MY' => 'Immunity', 'ms-MY' => 'Imuniti', 'zh-CN' => '免疫力'], 'children' => []],
                    ['slug' => 'heart-blood-pressure', 'sort' => 4, 'names' => ['en-MY' => 'Heart & Blood Pressure', 'ms-MY' => 'Jantung & Tekanan Darah', 'zh-CN' => '心脏血压'], 'children' => []],
                    ['slug' => 'kids-vitamins', 'sort' => 5, 'names' => ['en-MY' => 'Kids Vitamins & Supplements', 'ms-MY' => 'Vitamin Kanak-Kanak', 'zh-CN' => '儿童维生素'], 'children' => []],
                ]
            ],
            [
                'slug' => 'food-beverage',
                'sort' => 1,
                'names' => ['en-MY' => 'Food & Beverage', 'ms-MY' => 'Makanan & Minuman', 'zh-CN' => '食品饮料'],
                'children' => [
                    ['slug' => 'protein', 'sort' => 0, 'names' => ['en-MY' => 'Protein Supplements', 'ms-MY' => 'Suplemen Protein', 'zh-CN' => '蛋白质'], 'children' => []],
                    ['slug' => 'health-drinks', 'sort' => 1, 'names' => ['en-MY' => 'Health Drinks', 'ms-MY' => 'Minuman Kesihatan', 'zh-CN' => '健康饮料'], 'children' => []],
                    ['slug' => 'snacks', 'sort' => 2, 'names' => ['en-MY' => 'Healthy Snacks', 'ms-MY' => 'Snek Sihat', 'zh-CN' => '健康零食'], 'children' => []],
                ]
            ],
            [
                'slug' => 'medical-supplies',
                'sort' => 2,
                'names' => ['en-MY' => 'Medical Supplies', 'ms-MY' => 'Bekalan Perubatan', 'zh-CN' => '医疗用品'],
                'children' => [
                    ['slug' => 'blood-glucose', 'sort' => 0, 'names' => ['en-MY' => 'Blood Glucose Monitors', 'ms-MY' => 'Monitor Glukosa', 'zh-CN' => '血糖仪'], 'children' => []],
                    ['slug' => 'blood-pressure-monitor', 'sort' => 1, 'names' => ['en-MY' => 'Blood Pressure Monitors', 'ms-MY' => 'Monitor Tekanan Darah', 'zh-CN' => '血压计'], 'children' => []],
                    ['slug' => 'first-aid', 'sort' => 2, 'names' => ['en-MY' => 'First Aid', 'ms-MY' => 'Pertolongan Cemas', 'zh-CN' => '急救用品'], 'children' => []],
                ]
            ],
            [
                'slug' => 'mom-baby',
                'sort' => 3,
                'names' => ['en-MY' => 'Mom & Baby', 'ms-MY' => 'Ibu & Bayi', 'zh-CN' => '妈妈婴儿'],
                'children' => [
                    ['slug' => 'baby-formula', 'sort' => 0, 'names' => ['en-MY' => 'Baby Formula', 'ms-MY' => 'Susu Formula', 'zh-CN' => '婴儿奶粉'], 'children' => []],
                    ['slug' => 'maternity', 'sort' => 1, 'names' => ['en-MY' => 'Maternity Care', 'ms-MY' => 'Penjagaan Ibu Mengandung', 'zh-CN' => '孕妇护理'], 'children' => []],
                ]
            ],
            [
                'slug' => 'skin-care',
                'sort' => 4,
                'names' => ['en-MY' => 'Skin Care', 'ms-MY' => 'Penjagaan Kulit', 'zh-CN' => '护肤品'],
                'children' => [
                    ['slug' => 'face-care', 'sort' => 0, 'names' => ['en-MY' => 'Face Care', 'ms-MY' => 'Penjagaan Muka', 'zh-CN' => '面部护理'], 'children' => []],
                    ['slug' => 'sunscreen', 'sort' => 1, 'names' => ['en-MY' => 'Sunscreen', 'ms-MY' => 'Pelindung Matahari', 'zh-CN' => '防晒品'], 'children' => []],
                    ['slug' => 'body-lotion', 'sort' => 2, 'names' => ['en-MY' => 'Body Lotion', 'ms-MY' => 'Losyen Badan', 'zh-CN' => '身体乳液'], 'children' => []],
                ]
            ],
            [
                'slug' => 'personal-care',
                'sort' => 5,
                'names' => ['en-MY' => 'Personal Care', 'ms-MY' => 'Penjagaan Diri', 'zh-CN' => '个人护理'],
                'children' => [
                    ['slug' => 'oral-care', 'sort' => 0, 'names' => ['en-MY' => 'Oral Care', 'ms-MY' => 'Penjagaan Mulut', 'zh-CN' => '口腔护理'], 'children' => []],
                    ['slug' => 'hair-care', 'sort' => 1, 'names' => ['en-MY' => 'Hair Care', 'ms-MY' => 'Penjagaan Rambut', 'zh-CN' => '护发品'], 'children' => []],
                    ['slug' => 'feminine-care', 'sort' => 2, 'names' => ['en-MY' => 'Feminine Care', 'ms-MY' => 'Penjagaan Wanita', 'zh-CN' => '女性护理'], 'children' => []],
                ]
            ],
        ];

        $this->seed($tree);

        $this->command->info('Seeded ' . Category::count() . ' categories with translations.');
    }

    private function seed(array $items, ?int $parentId = null): void
    {
        foreach ($items as $item) {
            $cat = Category::firstOrCreate(
                ['slug' => $item['slug']],
                ['parent_id' => $parentId, 'sort_order' => $item['sort'], 'is_active' => true]
            );

            foreach ($item['names'] as $lang => $name) {
                CategoryTranslation::firstOrCreate(
                    ['category_id' => $cat->id, 'language_code' => $lang],
                    ['name' => $name]
                );
            }

            if (!empty($item['children'])) {
                $this->seed($item['children'], $cat->id);
            }
        }
    }
}
