<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_fetch_settings()
    {
        Setting::create([
            'key' => 'seo.title',
            'value' => 'Test Title',
            'type' => 'string',
            'group' => 'seo',
        ]);

        Setting::create([
            'key' => 'social.facebook',
            'value' => 'http://facebook.com',
            'type' => 'string',
            'group' => 'social',
        ]);

        $response = $this->getJson('/api/en-MY/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'seo' => [
                        'title'
                    ],
                    'social' => [
                        'facebook'
                    ]
                ],
                'meta' => [
                    'timestamp'
                ]
            ]);

        $response->assertJsonPath('data.seo.title', 'Test Title');
    }
}
