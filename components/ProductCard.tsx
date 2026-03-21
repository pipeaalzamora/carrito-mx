interface Ingredient { id: string; name: string; price: number; available: boolean; }
interface Product {
  id: string; name: string; description: string; price: number;
  image: string; category: string; ingredients: Ingredient[]; available: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-[#FEE2E2] hover:border-[#CA8A04]/40 hover:-translate-y-1">
      <div className="relative h-48 sm:h-52 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full bg-[#FEE2E2] flex items-center justify-center">
            <span className="text-[#FECACA] text-5xl">🌮</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#450A0A]/60 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-[#006847] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-md">
          {product.category}
        </span>
        <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#DC2626] font-heading text-2xl px-4 py-1 rounded-2xl shadow-lg">
          ${product.price.toLocaleString('es-CL')}
        </span>
        {!product.available && (
          <div className="absolute inset-0 bg-[#450A0A]/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-heading text-2xl tracking-wide">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-heading text-xl text-[#450A0A] leading-tight mb-1">{product.name}</h3>
          <p className="text-sm text-[#78350F] leading-relaxed">{product.description}</p>
        </div>
        {product.ingredients.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-[#78350F] uppercase tracking-[0.15em] mb-2">Incluye</p>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing) => (
                <span key={ing.id} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FEF2F2] text-[#78350F] border border-[#FEE2E2]">
                  {ing.name}{ing.price > 0 && <span className="ml-1 opacity-60">+${ing.price.toLocaleString('es-CL')}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
