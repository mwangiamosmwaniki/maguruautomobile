<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        $cars = [
            [
                'title' => '2023 Toyota Camry XLE',
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2023,
                'mileage' => 28000,
                'price' => 3200000,
                'transmission' => 'Automatic',
                'fuel_type' => 'Petrol',
                'body_type' => 'Sedan',
                'color' => 'Silver',
                'engine_cc' => 2500,
                'condition' => 'Good',
                'status' => 'Available',
                'description' => 'Well-maintained family sedan with full service history.',
            ],
            [
                'title' => '2022 Honda CR-V Sport',
                'make' => 'Honda',
                'model' => 'CR-V',
                'year' => 2022,
                'mileage' => 42000,
                'price' => 4100000,
                'transmission' => 'Automatic',
                'fuel_type' => 'Hybrid',
                'body_type' => 'SUV',
                'color' => 'Blue',
                'engine_cc' => 1500,
                'condition' => 'Like New',
                'status' => 'Available',
                'description' => 'Hybrid SUV, excellent fuel economy. One owner.',
            ],
            [
                'title' => '2021 BMW 320i M-Sport',
                'make' => 'BMW',
                'model' => '320i',
                'year' => 2021,
                'mileage' => 55000,
                'price' => 5800000,
                'transmission' => 'Automatic',
                'fuel_type' => 'Petrol',
                'body_type' => 'Sedan',
                'color' => 'Black',
                'engine_cc' => 2000,
                'condition' => 'Good',
                'status' => 'Sold',
                'description' => 'M-Sport package, panoramic sunroof, full leather.',
            ],
        ];

        foreach ($cars as $car) {
            Car::create($car);
        }
    }
}