import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Promotion } from '@/lib/models';

export async function GET() {
  await connectDB();
  const promos = await Promotion.find({ active: true })
    .select('id name description discount type productIds -_id')
    .lean();
  return NextResponse.json(promos);
}
