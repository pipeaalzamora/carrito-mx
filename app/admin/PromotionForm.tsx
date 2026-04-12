'use client';
import { useState, useEffect } from 'react';

export default function PromotionForm({ promotion, products, onSaved, onClose }: { promotion: any; products: any[]; onSaved: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', discount: 0, type: 'percentage' as 'percentage' | 'fixed', productIds: [] as string[], active: true, image: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (promotion) setForm({ name: promotion.name, description: promotion.description, discount: promotion.discount, type: promotion.type, productIds: [...promotion.productIds], active: promotion.active, image: promotion.image });
  }, [promotion]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const compressed = await compressToWebP(file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name.replace(/\.[^.]+$/, '.webp'), contentType: 'image/webp' }),
    });
    if (!res.ok) { setUploading(false); return; }
    const { signedUrl, publicUrl } = await res.json();

    await fetch(signedUrl, { method: 'PUT', body: compressed, headers: { 'Content-Type': 'image/webp' } });

    setForm(f => ({ ...f, image: publicUrl }));
    setUploading(false);
  }

  function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Compresión fallida')), 'image/webp', 0.82);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  function toggleProduct(id: string) {
    setForm(f => ({ ...f, productIds: f.productIds.includes(id) ? f.productIds.filter(p => p !== id) : [...f.productIds, id] }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.discount) return;
    setLoading(true);
    const url = promotion ? `/api/admin/promotions/${promotion.id}` : '/api/admin/promotions';
    await fetch(url, { method: promotion ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setLoading(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-cta p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-heading text-white text-xl">{promotion ? 'Editar' : 'Nueva'} Promoción</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-1">Nombre</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Ej: 2x1 en Tacos" className="w-full px-4 py-2.5 bg-brand-bg border-2 border-brand-border-light rounded-xl focus:border-[#CA8A04] outline-none text-brand-dark font-semibold" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-1">Descripción</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-brand-bg border-2 border-brand-border-light rounded-xl focus:border-[#CA8A04] outline-none text-brand-dark resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-1">Tipo</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-4 py-2.5 bg-brand-bg border-2 border-brand-border-light rounded-xl outline-none text-brand-dark font-semibold cursor-pointer focus:border-[#CA8A04]">
                <option value="percentage">Porcentaje %</option>
                <option value="fixed">Monto fijo $</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-1">Descuento</label>
              <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} required className="w-full px-4 py-2.5 bg-brand-bg border-2 border-brand-border-light rounded-xl outline-none text-brand-dark font-semibold focus:border-[#CA8A04]" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-1">Imagen (opcional)</label>
            {form.image ? (
              <div className="relative mb-2">
                <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-2xl border-2 border-brand-border-light" />
                <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} className="absolute top-2 right-2 w-7 h-7 bg-primary text-white rounded-xl flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-brand-border rounded-2xl cursor-pointer bg-brand-bg hover:border-[#CA8A04] transition-all group">
                {uploading ? <div className="w-7 h-7 border-2 border-[#CA8A04] border-t-transparent rounded-full animate-spin" /> : <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-border group-hover:text-[#CA8A04] transition-colors mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  <span className="text-xs font-bold text-brand-dark-muted group-hover:text-[#CA8A04] transition-colors">Subir imagen</span>
                </>}
                <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-bold text-brand-dark-muted uppercase tracking-[0.15em] mb-2">Productos que aplica</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {products.map(p => (
                <label key={p.id} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${form.productIds.includes(p.id) ? 'bg-cta text-white' : 'bg-brand-bg text-brand-dark-muted hover:bg-cta/10'}`}>
                  <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} className="sr-only" />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#CA8A04] cursor-pointer" />
            <span className="text-sm font-semibold text-brand-dark">Activa</span>
          </label>
          <button type="submit" disabled={loading} className="w-full bg-cta hover:bg-cta-hover disabled:bg-brand-border-light text-white font-bold py-3 rounded-2xl transition-all cursor-pointer text-sm uppercase tracking-wide">
            {loading ? 'Guardando...' : promotion ? 'Actualizar Promoción' : 'Crear Promoción'}
          </button>
        </form>
      </div>
    </div>
  );
}
