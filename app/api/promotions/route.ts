import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Promotion } from '@/lib/models';

export async function GET() {
  await connectDB();
  const promos = await Promotion.find({ active: true }).lean();
  return NextResponse.json(promos);
}
