'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function MenuClient({ products, promotions, categories }: { products: any[]; promotions: any[]; categories: string[] }) {
  const [category, setCategory] = useState('todos');
  const filtered = category === 'todos' ? products : products.filter(p => p.category === category);

  const allCategories = [
    { value: 'todos', label: 'Todos' },
    ...categories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pb-20 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #006847 0%, #006847 30%, #ffffff 45%, #ffffff 55%, #DC2626 70%, #DC2626 100%)' }}>
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative max-w-6xl mx-auto text-center pt-16">
          <div className="w-36 h-36 mx-auto mb-6 rounded-3xl border-4 border-black/10 shadow-2xl overflow-hidden">
            <img src="/Logo.jpeg" alt="Mr.Bull" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.1] mb-4">
            <span className="text-primary">Mr.Bull</span>
          </h1>
          <p className="text-base md:text-xl text-black/70 max-w-2xl mx-auto leading-relaxed font-light px-2">
            Mexican food, sandwich and hot dog. El mejor sabor en cada bocado.
          </p>
          <div className="flex justify-center gap-1.5 mt-8">
            <div className="w-20 h-2 rounded-full bg-mexico-green shadow-sm" />
            <div className="w-20 h-2 rounded-full bg-white border border-black/10" />
            <div className="w-20 h-2 rounded-full bg-primary shadow-sm" />
          </div>
        </div>
      </section>

      {/* Promociones */}
      {promotions.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {promotions.map(promo => (
              <div key={promo.id} className="snap-start shrink-0 w-80 bg-linear-to-br from-[#CA8A04] to-cta-hover rounded-2xl p-5 text-black shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Promoción</span>
                    <h3 className="font-heading text-xl mt-1">{promo.name}</h3>
                    <p className="text-sm text-black/70 mt-1">{promo.description}</p>
                  </div>
                  <div className="bg-black/10 rounded-2xl px-3 py-2 text-center shrink-0 ml-3">
                    <span className="text-2xl font-bold block leading-none">{promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount.toLocaleString('es-CL')}`}</span>
                    <span className="text-[10px] uppercase">{promo.type === 'percentage' ? 'OFF' : 'Dcto'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filtros */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {allCategories.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer tracking-wide whitespace-nowrap ${category === cat.value ? 'bg-primary text-white shadow-lg' : 'bg-white text-[#78350F] hover:bg-[#FFF7ED] border border-[#FEE2E2]'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#78350F]">No hay productos aquí</p>
            <p className="text-sm text-[#78350F]/60 mt-1">Prueba otra categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#450A0A] text-white/60 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-heading text-white text-xl tracking-wide">Mr.Bull</p>
          <p className="text-sm mt-1">Mexican food, sandwich and hot dog</p>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-8 h-1 rounded-full bg-mexico-green" />
            <div className="w-8 h-1 rounded-full bg-white/40" />
            <div className="w-8 h-1 rounded-full bg-primary" />
          </div>
          <Link href="/admin" className="inline-block mt-6 text-white text-xs transition-colors">
            Panel Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
