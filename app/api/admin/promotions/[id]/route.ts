import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Promotion } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const promo = await Promotion.findOneAndUpdate({ id }, body, { new: true });
  return NextResponse.json(promo);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await Promotion.findOneAndDelete({ id });
  return NextResponse.json({ ok: true });
}
