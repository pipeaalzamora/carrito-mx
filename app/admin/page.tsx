import { connectDB } from '@/lib/mongodb';
import { Product, Promotion } from '@/lib/models';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let products: any[] = [];
  let promotions: any[] = [];

  try {
    await connectDB();
    const rawProducts = await Product.find().lean();
    const rawPromotions = await Promotion.find().lean();
    products = JSON.parse(JSON.stringify(rawProducts));
    promotions = JSON.parse(JSON.stringify(rawPromotions));
  } catch (e) {
    console.error('[Admin] DB error:', e);
  }

  return (
    <DashboardClient
      initialProducts={products}
      initialPromotions={promotions}
    />
  );
}
