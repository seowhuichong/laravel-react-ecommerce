<?php

namespace Tests\Unit;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_setting()
    {
        $setting = Setting::create([
            'key' => 'test.key',
            'value' => 'test value',
            'type' => 'string',
            'group' => 'test_group',
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'test.key',
            'value' => 'test value',
        ]);
    }

    public function test_it_casts_boolean_values()
    {
        $setting = Setting::create([
            'key' => 'test.boolean',
            'value' => '1',
            'type' => 'boolean',
        ]);

        $this->assertTrue($setting->getValue());

        $setting->setValue(false);
        $this->assertEquals('0', $setting->value);
    }

    public function test_it_casts_integer_values()
    {
        $setting = Setting::create([
            'key' => 'test.integer',
            'value' => '123',
            'type' => 'integer',
        ]);

        $this->assertEquals(123, $setting->getValue());
        $this->assertIsInt($setting->getValue());
    }

    public function test_it_casts_json_values()
    {
        $data = ['foo' => 'bar'];
        $setting = Setting::create([
            'key' => 'test.json',
            'value' => json_encode($data),
            'type' => 'json',
        ]);

        $this->assertEquals($data, $setting->getValue());
        $this->assertIsArray($setting->getValue());
    }
}
