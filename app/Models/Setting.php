<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    /**
     * Get the setting value with proper type casting
     */
    public function getValue()
    {
        return match ($this->type) {
                'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
                'integer' => (int)$this->value,
                'json' => json_decode($this->value, true),
                default => $this->value,
            };
    }

    /**
     * Set the setting value with proper type conversion
     */
    public function setValue($value): void
    {
        $this->value = match ($this->type) {
                'boolean' => $value ? '1' : '0',
                'integer' => (string)$value,
                'json' => json_encode($value),
                default => (string)$value,
            };
    }

    /**
     * Scope to filter by group
     */
    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }
}
