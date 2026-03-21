import { connectDB } from '@/lib/mongodb';
import { Product, Promotion } from '@/lib/models';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await connectDB();
  const products = await Product.find().lean();
  const promotions = await Promotion.find().lean();
  return (
    <DashboardClient
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialPromotions={JSON.parse(JSON.stringify(promotions))}
    />
  );
}
