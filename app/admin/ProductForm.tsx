'use client';
import { useState, useEffect } from 'react';

const BASE_CATEGORIES = ['tacos', 'completos', 'bebidas', 'extras'];

function formatCLP(value: number) {
  if (!value) return '';
  return value.toLocaleString('es-CL');
}

function parseCLP(str: string) {
  return parseInt(str.replace(/\./g, '').replace(/[^0-9]/g, ''), 10) || 0;
}

export default function ProductForm({ product, onSaved, onClose }: { product: any; onSaved: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', price: 0, image: '', category: 'tacos', ingredients: [] as any[], available: true });
  const [priceDisplay, setPriceDisplay] = useState('');
  const [categories, setCategories] = useState<string[]>(BASE_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, description: product.description, price: product.price, image: product.image, category: product.category, ingredients: product.ingredients.map((i: any) => ({ ...i })), available: product.available });
      setPriceDisplay(formatCLP(product.price));
      // si la categoría del producto no está en la lista, agregarla
      if (!BASE_CATEGORIES.includes(product.category)) {
        setCategories(c => c.includes(product.category) ? c : [...c, product.category]);
      }
    }
  }, [product]);

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseCLP(e.target.value);
    setForm(f => ({ ...f, price: raw }));
    setPriceDisplay(raw ? formatCLP(raw) : '');
  }

  function addCategory() {
    const cat = newCategory.trim().toLowerCase();
    if (!cat || categories.includes(cat)) return;
    setCategories(c => [...c, cat]);
    setForm(f => ({ ...f, category: cat }));
    setNewCategory('');
    setShowNewCategory(false);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.ok) { const { url } = await res.json(); setForm(f => ({ ...f, image: url })); }
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setLoading(true);
    const payload = { ...form, ingredients: form.ingredients.filter(i => i.name) };
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
    await fetch(url, { method: product ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setLoading(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#450A0A]/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-[#006847] p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-heading text-white text-xl">{product ? 'Editar' : 'Nuevo'} Producto</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-1">Nombre</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-4 py-2.5 bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-xl focus:border-[#006847] outline-none text-[#450A0A] font-semibold" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-1">Descripción</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-xl focus:border-[#006847] outline-none text-[#450A0A] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-1">Precio (CLP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78350F] font-bold text-sm">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  required
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-2.5 bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-xl focus:border-[#006847] outline-none text-[#450A0A] font-semibold [appearance:textfield]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-1">Categoría</label>
              <select value={form.category} onChange={e => { if (e.target.value === '__new__') { setShowNewCategory(true); } else { setForm(f => ({ ...f, category: e.target.value })); } }}
                className="w-full px-4 py-2.5 bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-xl focus:border-[#006847] outline-none text-[#450A0A] font-semibold cursor-pointer capitalize">
                {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
                <option value="__new__">+ Nueva categoría</option>
              </select>
            </div>
          </div>

          {showNewCategory && (
            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                placeholder="Nombre de la categoría"
                className="flex-1 px-4 py-2.5 bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-xl focus:border-[#006847] outline-none text-[#450A0A] font-semibold"
                autoFocus
              />
              <button type="button" onClick={addCategory} className="bg-[#006847] text-white font-bold px-4 rounded-xl cursor-pointer hover:bg-[#004D33] transition-colors">OK</button>
              <button type="button" onClick={() => setShowNewCategory(false)} className="bg-[#FEE2E2] text-[#DC2626] font-bold px-4 rounded-xl cursor-pointer">✕</button>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-1">Imagen</label>
            {form.image ? (
              <div className="relative mb-2">
                <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-2xl border-2 border-[#FEE2E2]" />
                <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} className="absolute top-2 right-2 w-7 h-7 bg-[#DC2626] text-white rounded-xl flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#FECACA] rounded-2xl cursor-pointer bg-[#FEF2F2] hover:border-[#006847] transition-all group">
                {uploading ? <div className="w-8 h-8 border-2 border-[#006847] border-t-transparent rounded-full animate-spin" /> : <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#FECACA] group-hover:text-[#006847] transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <span className="text-sm font-bold text-[#78350F] group-hover:text-[#006847] transition-colors">Haz clic o arrastra</span>
                  <span className="text-xs text-[#78350F]/60 mt-1">JPG, PNG o WebP</span>
                </>}
                <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em]">Ingredientes</label>
              <button type="button" onClick={() => setForm(f => ({ ...f, ingredients: [...f.ingredients, { id: `ing-${Date.now()}`, name: '', price: 0, available: true }] }))} className="text-[#006847] text-xs font-bold cursor-pointer hover:underline">+ Agregar</button>
            </div>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input value={ing.name} onChange={e => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], name: e.target.value }; setForm(f => ({ ...f, ingredients: arr })); }} placeholder="Nombre del ingrediente" className="flex-1 px-3 py-2 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-sm text-[#450A0A] outline-none focus:border-[#006847]" />
                <button type="button" onClick={() => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, j) => j !== i) }))} className="text-[#DC2626] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="w-4 h-4 accent-[#006847] cursor-pointer" />
            <span className="text-sm font-semibold text-[#450A0A]">Disponible</span>
          </label>
          <button type="submit" disabled={loading} className="w-full bg-[#DC2626] hover:bg-[#991B1B] disabled:bg-[#FECACA] text-white font-bold py-3 rounded-2xl transition-all cursor-pointer text-sm uppercase tracking-wide">
            {loading ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
