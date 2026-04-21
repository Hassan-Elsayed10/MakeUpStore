import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { categories, products, featureSettings, reviews } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/makeup_store';
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log('🌱 Seeding database...');

  // Idempotency check — skip if already seeded
  try {
    const existing = await db.select().from(categories).limit(1);
    if (existing.length > 0) {
      console.log('✅ Database already seeded. Skipping...');
      await client.end();
      process.exit(0);
    }
  } catch {
    // Tables may not exist yet — continue to seed
  }

  // Seed categories
  const categoryData = [
    { nameEn: 'Lips', nameAr: 'الشفاه', slug: 'lips', image: null },
    { nameEn: 'Eyes', nameAr: 'العيون', slug: 'eyes', image: null },
    { nameEn: 'Face', nameAr: 'الوجه', slug: 'face', image: null },
    { nameEn: 'Skin Care', nameAr: 'العناية بالبشرة', slug: 'skin', image: null },
    { nameEn: 'Tools & Brushes', nameAr: 'الأدوات والفرش', slug: 'tools', image: null },
    { nameEn: 'Fragrance', nameAr: 'العطور', slug: 'fragrance', image: null },
  ];

  console.log('  📁 Inserting categories...');
  const insertedCategories = await db.insert(categories).values(categoryData).returning();

  const catMap: Record<string, number> = {};
  insertedCategories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // Seed products
  const productData = [
    {
      nameEn: 'Velvet Matte Lipstick',
      nameAr: 'أحمر شفاه مخملي مطفي',
      descriptionEn: 'A luxurious matte lipstick with rich, long-lasting color and a comfortable velvet finish. Enriched with vitamin E for moisturized lips all day.',
      descriptionAr: 'أحمر شفاه مطفي فاخر بلون غني وطويل الأمد مع لمسة مخملية مريحة. غني بفيتامين E لترطيب الشفاه طوال اليوم.',
      price: '24.99',
      discountPrice: '19.99',
      isOnSale: true,
      image: null,
      categoryId: catMap.lips,
      featured: true,
    },
    {
      nameEn: 'Hydra Lip Gloss',
      nameAr: 'ملمع شفاه مرطب',
      descriptionEn: 'A high-shine lip gloss with a non-sticky formula. Provides intense hydration and a plump look.',
      descriptionAr: 'ملمع شفاه لامع بتركيبة غير لزجة. يوفر ترطيبًا مكثفًا ومظهرًا ممتلئًا.',
      price: '18.99',
      image: null,
      categoryId: catMap.lips,
      featured: false,
    },
    {
      nameEn: 'Precision Eyeliner Pen',
      nameAr: 'قلم كحل دقيق',
      descriptionEn: 'Ultra-precise felt-tip eyeliner for flawless cat eyes and defined lines. Waterproof and smudge-proof for 24-hour wear.',
      descriptionAr: 'كحل بطرف لباد فائق الدقة لعيون قطة خالية من العيوب وخطوط محددة. مقاوم للماء والتلطخ لمدة 24 ساعة.',
      price: '16.99',
      image: null,
      categoryId: catMap.eyes,
      featured: true,
    },
    {
      nameEn: 'Galaxy Eyeshadow Palette',
      nameAr: 'لوحة ظلال العيون جالاكسي',
      descriptionEn: '12 richly pigmented shades ranging from shimmering golds to deep cosmic purples. Perfect for creating day-to-night looks.',
      descriptionAr: '12 ظلًا غنيًا بالألوان تتراوح من الذهبي اللامع إلى الأرجواني الكوني العميق. مثالية لإنشاء إطلالات من النهار إلى الليل.',
      price: '42.99',
      discountPrice: '34.99',
      isOnSale: true,
      image: null,
      categoryId: catMap.eyes,
      featured: true,
    },
    {
      nameEn: 'Silk Foundation SPF 30',
      nameAr: 'كريم أساس حريري SPF 30',
      descriptionEn: 'A lightweight, buildable foundation with a natural satin finish. Provides medium-to-full coverage with sun protection.',
      descriptionAr: 'كريم أساس خفيف وقابل للبناء بلمسة حريرية طبيعية. يوفر تغطية متوسطة إلى كاملة مع حماية من الشمس.',
      price: '36.99',
      image: null,
      categoryId: catMap.face,
      featured: true,
    },
    {
      nameEn: 'Radiance Blush Duo',
      nameAr: 'بلاشر إشراقة ثنائي',
      descriptionEn: 'A duo of complementary blush shades that blend seamlessly for a natural, healthy glow. Silky-smooth formula.',
      descriptionAr: 'ثنائي من ظلال البلاشر المتكاملة التي تمتزج بسلاسة لتوهج طبيعي وصحي. تركيبة ناعمة كالحرير.',
      price: '28.99',
      image: null,
      categoryId: catMap.face,
      featured: false,
    },
    {
      nameEn: 'Vitamin C Brightening Serum',
      nameAr: 'سيروم فيتامين سي المنير',
      descriptionEn: 'A powerful brightening serum with 15% Vitamin C to fade dark spots, even skin tone, and boost radiance.',
      descriptionAr: 'سيروم منير قوي بنسبة 15٪ فيتامين سي لتفتيح البقع الداكنة وتوحيد لون البشرة وتعزيز الإشراق.',
      price: '45.99',
      discountPrice: '39.99',
      isOnSale: true,
      image: null,
      categoryId: catMap.skin,
      featured: true,
    },
    {
      nameEn: 'Rose Hydrating Moisturizer',
      nameAr: 'مرطب الورد المرطب',
      descriptionEn: 'A lightweight gel-cream moisturizer infused with rose water and hyaluronic acid for 72-hour hydration.',
      descriptionAr: 'مرطب جل-كريم خفيف مع ماء الورد وحمض الهيالورونيك لترطيب لمدة 72 ساعة.',
      price: '32.99',
      image: null,
      categoryId: catMap.skin,
      featured: false,
    },
    {
      nameEn: 'Professional Brush Set',
      nameAr: 'طقم فرش احترافي',
      descriptionEn: 'A set of 12 essential makeup brushes with ultra-soft synthetic bristles and ergonomic handles. Includes a carrying case.',
      descriptionAr: 'طقم من 12 فرشاة مكياج أساسية بشعيرات صناعية فائقة النعومة ومقابض مريحة. يتضمن حقيبة حمل.',
      price: '54.99',
      image: null,
      categoryId: catMap.tools,
      featured: true,
    },
    {
      nameEn: 'Lash Curler Pro',
      nameAr: 'أداة تجعيد الرموش برو',
      descriptionEn: 'A professional-grade eyelash curler with silicone pads for gentle, long-lasting curl without crimping.',
      descriptionAr: 'أداة تجعيد رموش احترافية مع وسادات سيليكون لتجعيد لطيف وطويل الأمد بدون تكسير.',
      price: '12.99',
      image: null,
      categoryId: catMap.tools,
      featured: false,
    },
    {
      nameEn: 'Rose Oud Eau de Parfum',
      nameAr: 'عطر عود وورد',
      descriptionEn: 'An enchanting blend of Bulgarian rose and rare oud wood. A sophisticated, long-lasting fragrance for every occasion.',
      descriptionAr: 'مزيج ساحر من الورد البلغاري وخشب العود النادر. عطر راقي وطويل الأمد لكل مناسبة.',
      price: '89.99',
      image: null,
      categoryId: catMap.fragrance,
      featured: true,
    },
    {
      nameEn: 'Setting Spray',
      nameAr: 'بخاخ تثبيت المكياج',
      descriptionEn: 'A micro-fine mist setting spray that locks makeup in place for up to 16 hours. Refreshes and hydrates.',
      descriptionAr: 'بخاخ تثبيت بضباب ناعم يثبت المكياج في مكانه لمدة تصل إلى 16 ساعة. ينعش ويرطب.',
      price: '22.99',
      image: null,
      categoryId: catMap.face,
      featured: false,
    },
  ];

  console.log('  📦 Inserting products...');
  const insertedProducts = await db.insert(products).values(productData).returning();

  // Seed reviews for some products
  console.log('  ⭐ Inserting reviews...');
  const reviewData = [
    { productId: insertedProducts[0].id, author: 'Sarah', rating: 5, comment: 'Absolutely love this lipstick! The color is gorgeous and it lasts all day.' },
    { productId: insertedProducts[0].id, author: 'Amira', rating: 4, comment: 'Beautiful shade, slightly drying after a few hours but still great.' },
    { productId: insertedProducts[3].id, author: 'Jessica', rating: 5, comment: 'The pigmentation is incredible! Best palette I have ever owned.' },
    { productId: insertedProducts[3].id, author: 'Nour', rating: 5, comment: 'These colors are stunning and blend like a dream.' },
    { productId: insertedProducts[4].id, author: 'Emily', rating: 4, comment: 'Great coverage without feeling heavy. Love the SPF too!' },
    { productId: insertedProducts[6].id, author: 'Dana', rating: 5, comment: 'My skin has never looked better! The results are visible in just a week.' },
    { productId: insertedProducts[8].id, author: 'Lina', rating: 5, comment: 'Professional quality brushes at a great price. Super soft!' },
    { productId: insertedProducts[10].id, author: 'Fatima', rating: 5, comment: 'An intoxicating scent. I get compliments every time I wear it.' },
  ];

  await db.insert(reviews).values(reviewData);

  // Seed feature settings
  console.log('  ⚙️ Inserting feature settings...');
  await db.insert(featureSettings).values([
    { key: 'cart_enabled', enabled: true },
    { key: 'orders_enabled', enabled: true },
  ]);

  console.log('✅ Database seeded successfully!');

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
