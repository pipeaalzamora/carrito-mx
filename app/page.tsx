import { connectDB } from '@/lib/mongodb';
import { Product, Promotion } from '@/lib/models';
import MenuClient from './MenuClient';

export const revalidate = 10; // ISR: regenera cada 10 segundos

export default async function Home() {
  let products: any[] = [];
  let promotions: any[] = [];
  let categories: string[] = [];

  try {
    await connectDB();
    const [rawProducts, rawPromotions] = await Promise.all([
      Product.find({ available: true })
        .select('id name description price image category ingredients available -_id')
        .lean(),
      Promotion.find({ active: true })
        .select('id name description discount type productIds -_id')
        .lean(),
    ]);
    products = JSON.parse(JSON.stringify(rawProducts));
    promotions = JSON.parse(JSON.stringify(rawPromotions));
    // Categorías únicas en el orden en que aparecen
    categories = [...new Set(products.map((p: any) => p.category as string))];
  } catch (e) {
    console.error('[Home] DB error:', e);
  }

  return <MenuClient products={products} promotions={promotions} categories={categories} />;
}
