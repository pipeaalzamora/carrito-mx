import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const product = await Product.findOneAndUpdate({ id }, body, { new: true });
  revalidatePath('/');
  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await Product.findOneAndDelete({ id });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const product = await Product.findOne({ id });
  if (!product) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  product.available = !product.available;
  await product.save();
  revalidatePath('/');
  return NextResponse.json(product);
}
