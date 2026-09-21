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
            ['category' => 'Appetizers', 'name_en' => 'Hummus', 'name_ar' => 'حمص', 'price' => 5.50, 'description_en' => 'Chickpea dip with tahini', 'description_ar' => 'غموس الحمص بالطحينة', 'image_url' => 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Appetizers', 'name_en' => 'Spring Rolls', 'name_ar' => 'سبرينغ رول', 'price' => 6.00, 'description_en' => 'Crispy vegetable rolls', 'description_ar' => 'لفائف خضار مقرمشة', 'image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Main Courses', 'name_en' => 'Grilled Chicken', 'name_ar' => 'دجاج مشوي', 'price' => 14.00, 'description_en' => 'Served with rice and salad', 'description_ar' => 'يقدم مع الأرز والسلطة', 'image_url' => 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Main Courses', 'name_en' => 'Beef Burger', 'name_ar' => 'برجر لحم', 'price' => 12.50, 'description_en' => 'With fries and coleslaw', 'description_ar' => 'مع البطاطس وسلطة الكرنب', 'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Main Courses', 'name_en' => 'Pasta Alfredo', 'name_ar' => 'باستا ألفريدو', 'price' => 13.00, 'description_en' => 'Creamy alfredo sauce', 'description_ar' => 'صلصة ألفريدو الكريمية', 'image_url' => 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Desserts', 'name_en' => 'Cheesecake', 'name_ar' => 'تشيز كيك', 'price' => 6.50, 'description_en' => 'Classic New York style', 'description_ar' => 'على الطراز الكلاسيكي', 'image_url' => 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Desserts', 'name_en' => 'Baklava', 'name_ar' => 'بقلاوة', 'price' => 5.00, 'description_en' => 'Sweet pastry with nuts', 'description_ar' => 'حلوى محشوة بالمكسرات', 'image_url' => 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Beverages', 'name_en' => 'Fresh Orange Juice', 'name_ar' => 'عصير برتقال طازج', 'price' => 4.00, 'description_en' => 'Freshly squeezed', 'description_ar' => 'عصير طازج', 'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80&auto=format&fit=crop'],
            ['category' => 'Beverages', 'name_en' => 'Arabic Coffee', 'name_ar' => 'قهوة عربية', 'price' => 3.00, 'description_en' => 'Traditional cardamom coffee', 'description_ar' => 'قهوة تقليدية بالهيل', 'image_url' => 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&q=80&auto=format&fit=crop'],
        ];

        foreach ($items as $item) {
            $category = $categoryModels->firstWhere('name_en', $item['category']);
            MenuItem::updateOrCreate(
                ['name_en' => $item['name_en']],
                [
                    'category_id' => $category->id,
                    'name_ar' => $item['name_ar'],
                    'description_en' => $item['description_en'],
                    'description_ar' => $item['description_ar'],
                    'price' => $item['price'],
                    'image_url' => $item['image_url'],
                    'available' => true,
                ]
            );
        }
    }
}
