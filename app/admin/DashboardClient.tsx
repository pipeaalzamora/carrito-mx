'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from './ProductForm';
import PromotionForm from './PromotionForm';

export default function DashboardClient({ initialProducts, initialPromotions }: { initialProducts: any[]; initialPromotions: any[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<'products' | 'promotions'>('products');
  const [products, setProducts] = useState(initialProducts);
  const [promotions, setPromotions] = useState(initialPromotions);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function reloadProducts() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  async function reloadPromotions() {
    const res = await fetch('/api/admin/promotions');
    setPromotions(await res.json());
  }

  async function deleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    reloadProducts();
  }

  async function toggleProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: 'PATCH' });
    reloadProducts();
  }

  async function deletePromo(id: string) {
    if (!confirm('¿Eliminar esta promoción?')) return;
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
    reloadPromotions();
  }

  return (
    <div className="min-h-screen bg-[#FEF2F2]">
      {/* Header */}
      <header className="pt-5 pb-6 px-4" style={{ background: 'linear-gradient(135deg, #006847 0%, #006847 30%, #ffffff 45%, #ffffff 55%, #DC2626 70%, #DC2626 100%)' }}>
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-black/10 shadow-md">
              <img src="/Logo.jpeg" alt="Mr.Bull" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-heading text-black text-2xl tracking-wide drop-shadow-sm">Panel Admin</h1>
              <p className="text-black/60 text-xs font-semibold">Mr.Bull</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="bg-black/10 hover:bg-black/20 text-black px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="hidden sm:inline">Ver Carta</span>
            </Link>
            <button onClick={logout} className="bg-black/10 hover:bg-black/20 text-black px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 flex gap-2 relative">
          <button onClick={() => setTab('products')} className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${tab === 'products' ? 'bg-primary text-white shadow-md' : 'bg-black/10 text-black hover:bg-black/20'}`}>Productos</button>
          <button onClick={() => setTab('promotions')} className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${tab === 'promotions' ? 'bg-cta text-black shadow-md' : 'bg-black/10 text-black hover:bg-black/20'}`}>Promociones</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Productos */}
        {tab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-brand-dark">Tus Productos</h2>
              <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="bg-mexico-green hover:bg-mexico-green-dark text-white font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Nuevo Producto
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {products.map((p: any) => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-brand-border-light overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-brand-border-light flex items-center justify-center text-4xl">🌮</div>}
                    <button onClick={() => toggleProduct(p.id)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center text-white cursor-pointer transition-colors shadow-md ${p.available ? 'bg-mexico-green' : 'bg-brand-border'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        {p.available ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />}
                      </svg>
                    </button>
                    <span className="absolute bottom-2 left-2 bg-brand-dark/80 text-white text-xs font-bold px-3 py-1 rounded-full">${p.price.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-sm text-brand-dark truncate">{p.name}</h3>
                    <p className="text-xs text-brand-dark-muted mt-0.5 truncate">{p.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="flex-1 bg-cta/10 hover:bg-cta/20 text-[#CA8A04] font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors">Editar</button>
                      <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Promociones */}
        {tab === 'promotions' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-brand-dark">Promociones</h2>
              <button onClick={() => { setEditingPromo(null); setShowPromoForm(true); }}
                className="bg-cta hover:bg-cta-hover text-white font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Nueva Promoción
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {promotions.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-brand-dark-muted">
                  <p className="font-heading text-lg">Sin promociones aún</p>
                  <p className="text-sm mt-1">Crea tu primera promoción</p>
                </div>
              ) : promotions.map((promo: any) => (
                <div key={promo.id} className="bg-white rounded-2xl shadow-sm border border-brand-border-light p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading text-lg text-brand-dark">{promo.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${promo.active ? 'bg-mexico-green/10 text-mexico-green' : 'bg-brand-border-light text-brand-dark-muted'}`}>{promo.active ? 'Activa' : 'Inactiva'}</span>
                      </div>
                      <p className="text-sm text-brand-dark-muted">{promo.description}</p>
                      <div className="mt-2 inline-block bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-xl">
                        {promo.type === 'percentage' ? `${promo.discount}% OFF` : `-$${promo.discount.toLocaleString('es-CL')}`}
                      </div>
                    </div>
                    {promo.image && <img src={promo.image} alt={promo.name} className="w-16 h-16 rounded-xl object-cover ml-4" />}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setEditingPromo(promo); setShowPromoForm(true); }} className="flex-1 bg-cta/10 hover:bg-cta/20 text-[#CA8A04] font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors">Editar</button>
                    <button onClick={() => deletePromo(promo.id)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showProductForm && <ProductForm product={editingProduct} onSaved={() => { setShowProductForm(false); reloadProducts(); }} onClose={() => setShowProductForm(false)} />}
      {showPromoForm && <PromotionForm promotion={editingPromo} products={products} onSaved={() => { setShowPromoForm(false); reloadPromotions(); }} onClose={() => setShowPromoForm(false)} />}
    </div>
  );
}
