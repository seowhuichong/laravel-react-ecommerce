<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // SEO Settings
            [
                'key' => 'seo.default_title',
                'value' => 'BIG Pharmacy - Your Trusted Online Pharmacy',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Default page title for SEO',
            ],
            [
                'key' => 'seo.default_description',
                'value' => 'Shop the best products online at BIG Pharmacy. We offer a wide range of health, beauty, and wellness products at affordable prices.',
                'type' => 'text',
                'group' => 'seo',
                'description' => 'Default meta description for SEO',
            ],
            [
                'key' => 'seo.site_name',
                'value' => 'BIG Pharmacy',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Site name for Open Graph tags',
            ],

            // Social Media Links
            [
                'key' => 'social.facebook_url',
                'value' => 'https://facebook.com/bigpharmacy',
                'type' => 'string',
                'group' => 'social',
                'description' => 'Facebook page URL',
            ],
            [
                'key' => 'social.linkedin_url',
                'value' => 'https://linkedin.com/company/bigpharmacy',
                'type' => 'string',
                'group' => 'social',
                'description' => 'LinkedIn company page URL',
            ],
            [
                'key' => 'social.instagram_url',
                'value' => 'https://instagram.com/bigpharmacy',
                'type' => 'string',
                'group' => 'social',
                'description' => 'Instagram profile URL',
            ],

            // Company Information
            [
                'key' => 'company.name',
                'value' => 'BIG Pharmacy',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Company name',
            ],
            [
                'key' => 'company.description',
                'value' => 'At BIG Pharmacy, we strive to be the most affordable pharmacy chain in Malaysia. We offer a wide range of products from organic food, supplements, rehabilitation supplies to health & beauty categories. Think pharmacy, think BIG.',
                'type' => 'text',
                'group' => 'company',
                'description' => 'Company description for footer',
            ],
            [
                'key' => 'company.copyright',
                'value' => '© 2026 CARING EStore Sdn Bhd Registration No.: 200901038640 (881773-W). All Rights Reserved.',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Copyright text for footer',
            ],
            [
                'key' => 'company.logo_path',
                'value' => '/images/logo.png',
                'type' => 'string',
                'group' => 'company',
                'description' => 'Path to company logo',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
            ['key' => $setting['key']],
                $setting
            );
        }
    }
}
