<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiTest extends TestCase
{
    /**
     * Test if the API returns a successful response.
     */
    public function test_api_returns_successful_response(): void
    {
        $response = $this->get('/api/test');

        $response->assertStatus(200);
    }

    /**
     * Test if the API returns the expected JSON structure.
     */
    public function test_api_returns_expected_json_structure(): void
    {
        $response = $this->get('/api/test');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'status'
                ]);
    }
} 