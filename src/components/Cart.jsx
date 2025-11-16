import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSummary } = useCart();

  return (
    <section className="glass-panel rounded-[32px] border border-slate-200/50 p-6 shadow-frame">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Collector's Cart</h2>
        <span className="text-sm uppercase tracking-[0.3em] text-mist">
          {cartSummary.count} piece{cartSummary.count === 1 ? '' : 's'}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        {cartItems.length === 0 && (
          <p className="text-sm text-mist">No works selected yet.</p>
        )}
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-mist">
                  {item.artist}
                </p>
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="text-sm text-slate-500">${item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                className="text-xs uppercase tracking-[0.3em] text-mist transition hover:text-ink"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>${cartSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Taxes</span>
          <span>${cartSummary.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-ink">
          <span>Total</span>
          <span>${cartSummary.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
};

export default Cart;
