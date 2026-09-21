<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        foreach (['admin', 'manager', 'user'] as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@restaurant.test'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );
        $admin->syncRoles(['admin']);

        $manager = User::firstOrCreate(
            ['email' => 'manager@restaurant.test'],
            ['name' => 'Manager', 'password' => bcrypt('password')]
        );
        $manager->syncRoles(['manager']);

        $customer = User::firstOrCreate(
            ['email' => 'customer@restaurant.test'],
            ['name' => 'Customer', 'password' => bcrypt('password')]
        );
        $customer->syncRoles(['user']);

        $categories = [
            ['name_en' => 'Appetizers', 'name_ar' => 'المقبلات'],
            ['name_en' => 'Main Courses', 'name_ar' => 'الأطباق الرئيسية'],
            ['name_en' => 'Desserts', 'name_ar' => 'الحلويات'],
            ['name_en' => 'Beverages', 'name_ar' => 'المشروبات'],
        ];

        $categoryModels = collect($categories)->map(fn ($c) => Category::firstOrCreate(
            ['name_en' => $c['name_en']],
            $c
        ));

        $items = [
            ['category' => 'Appetizers', 'name_en' => 'Hummus', 'name_ar' => 'حمص', 'price' => 5.50, 'description_en' => 'Chickpea dip with tahini', 'description_ar' => 'غموس الحمص بالطحينة'],
            ['category' => 'Appetizers', 'name_en' => 'Spring Rolls', 'name_ar' => 'سبرينغ رول', 'price' => 6.00, 'description_en' => 'Crispy vegetable rolls', 'description_ar' => 'لفائف خضار مقرمشة'],
            ['category' => 'Main Courses', 'name_en' => 'Grilled Chicken', 'name_ar' => 'دجاج مشوي', 'price' => 14.00, 'description_en' => 'Served with rice and salad', 'description_ar' => 'يقدم مع الأرز والسلطة'],
            ['category' => 'Main Courses', 'name_en' => 'Beef Burger', 'name_ar' => 'برجر لحم', 'price' => 12.50, 'description_en' => 'With fries and coleslaw', 'description_ar' => 'مع البطاطس وسلطة الكرنب'],
            ['category' => 'Main Courses', 'name_en' => 'Pasta Alfredo', 'name_ar' => 'باستا ألفريدو', 'price' => 13.00, 'description_en' => 'Creamy alfredo sauce', 'description_ar' => 'صلصة ألفريدو الكريمية'],
            ['category' => 'Desserts', 'name_en' => 'Cheesecake', 'name_ar' => 'تشيز كيك', 'price' => 6.50, 'description_en' => 'Classic New York style', 'description_ar' => 'على الطراز الكلاسيكي'],
            ['category' => 'Desserts', 'name_en' => 'Baklava', 'name_ar' => 'بقلاوة', 'price' => 5.00, 'description_en' => 'Sweet pastry with nuts', 'description_ar' => 'حلوى محشوة بالمكسرات'],
            ['category' => 'Beverages', 'name_en' => 'Fresh Orange Juice', 'name_ar' => 'عصير برتقال طازج', 'price' => 4.00, 'description_en' => 'Freshly squeezed', 'description_ar' => 'عصير طازج'],
            ['category' => 'Beverages', 'name_en' => 'Arabic Coffee', 'name_ar' => 'قهوة عربية', 'price' => 3.00, 'description_en' => 'Traditional cardamom coffee', 'description_ar' => 'قهوة تقليدية بالهيل'],
        ];

        foreach ($items as $item) {
            $category = $categoryModels->firstWhere('name_en', $item['category']);
            MenuItem::firstOrCreate(
                ['name_en' => $item['name_en']],
                [
                    'category_id' => $category->id,
                    'name_ar' => $item['name_ar'],
                    'description_en' => $item['description_en'],
                    'description_ar' => $item['description_ar'],
                    'price' => $item['price'],
                    'available' => true,
                ]
            );
        }
    }
}
