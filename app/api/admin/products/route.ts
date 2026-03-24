import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const id = `prod-${Date.now()}`;
  const product = await Product.create({ ...body, id });
  revalidatePath('/');
  return NextResponse.json(product, { status: 201 });
}
