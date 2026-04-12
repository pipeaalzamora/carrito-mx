import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Clave secreta para proteger el endpoint (opcional pero recomendado)
const KEEPALIVE_SECRET = process.env.KEEPALIVE_SECRET;

export async function GET(request: Request) {
  // Verificar secret si está configurado
  if (KEEPALIVE_SECRET) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== KEEPALIVE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    await connectDB();
    // Ping simple a MongoDB para mantener la conexión activa
    await mongoose.connection.db!.admin().ping();
    return NextResponse.json({
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[keepalive] DB ping failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'DB ping failed', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
