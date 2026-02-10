<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\SettingsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SettingsServiceTest extends TestCase
{
    use RefreshDatabase;

    private SettingsService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SettingsService();
    }

    public function test_it_can_get_a_setting()
    {
        Setting::create([
            'key' => 'test.key',
            'value' => 'test value',
            'type' => 'string',
        ]);

        $this->assertEquals('test value', $this->service->get('test.key'));
    }

    public function test_it_can_set_a_setting()
    {
        Setting::create([
            'key' => 'test.key',
            'value' => 'old value',
            'type' => 'string',
        ]);

        $this->service->set('test.key', 'new value');

        $this->assertDatabaseHas('settings', [
            'key' => 'test.key',
            'value' => 'new value',
        ]);
    }

    public function test_it_caches_settings()
    {
        Setting::create([
            'key' => 'test.key',
            'value' => 'cached value',
            'type' => 'string',
        ]);

        // First call should cache
        $this->service->all();

        $this->assertTrue(Cache::has('settings.all'));
    }

    public function test_it_clears_cache_on_set()
    {
        Setting::create([
            'key' => 'test.key',
            'value' => 'initial',
            'type' => 'string',
        ]);

        $this->service->all(); // cache it
        $this->assertTrue(Cache::has('settings.all'));

        $this->service->set('test.key', 'updated');

        $this->assertFalse(Cache::has('settings.all'));
    }
}
