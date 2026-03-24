import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = category ? { category } : {};
  const products = await Product.find(query)
    .select('id name description price image category ingredients available -_id')
    .lean();
  return NextResponse.json(products);
}
