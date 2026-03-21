import { connectDB } from '@/lib/mongodb';
import { Product, Promotion } from '@/lib/models';
import MenuClient from './MenuClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const products = await Product.find().lean();
  const promotions = await Promotion.find({ active: true }).lean();
  return <MenuClient products={JSON.parse(JSON.stringify(products))} promotions={JSON.parse(JSON.stringify(promotions))} />;
}
