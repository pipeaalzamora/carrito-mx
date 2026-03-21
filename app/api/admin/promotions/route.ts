import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Promotion } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const promos = await Promotion.find().lean();
  return NextResponse.json(promos);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const promo = await Promotion.create({ ...body, id: `promo-${Date.now()}` });
  return NextResponse.json(promo, { status: 201 });
}
