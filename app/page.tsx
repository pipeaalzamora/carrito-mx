import { connectDB } from '@/lib/mongodb';
import { Product, Promotion } from '@/lib/models';
import MenuClient from './MenuClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: any[] = [];
  let promotions: any[] = [];

  try {
    await connectDB();
    const rawProducts = await Product.find({ available: true }).lean();
    const rawPromotions = await Promotion.find({ active: true }).lean();
    products = JSON.parse(JSON.stringify(rawProducts));
    promotions = JSON.parse(JSON.stringify(rawPromotions));
  } catch (e) {
    console.error('[Home] DB error:', e);
  }

  return <MenuClient products={products} promotions={promotions} />;
}
