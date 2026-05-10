import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useOrderStore } from '../stores/useOrderStore'

const MENU_CATEGORIES = ['All Items', 'Breakfast', 'Lunch', 'Snacks', 'Drinks']

const MOCK_MENU = [
  { 
    id: 'm1', 
    name: 'Artisan Avocado Toast', 
    category: 'Breakfast', 
    price: 1250, 
    desc: 'Smashed organic avocado, chili flakes, and a perfectly poached farm egg on toasted sourdough.', 
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=800',
    tags: ['Gluten-Free Available', 'Vegan Option'],
    inStock: true
  },
  { 
    id: 'm2', 
    name: 'Quinoa Harvest Bowl', 
    category: 'Lunch', 
    price: 1400, 
    desc: 'Roasted seasonal vegetables, tri-color quinoa, and lemon-tahini dressing. Nut-free and high protein.', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tags: ['High Protein', 'Nut-Free'],
    inStock: false
  },
  { 
    id: 'm3', 
    name: 'Cacao Power Bites', 
    category: 'Snacks', 
    price: 650, 
    desc: 'Raw organic cacao, medjool dates, and crushed walnuts. The perfect afternoon pick-me-up.', 
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
    tags: ['Contains Nuts'],
    inStock: true
  },
  { 
    id: 'm4', 
    name: 'Iced Matcha Latte', 
    category: 'Drinks', 
    price: 575, 
    desc: 'Ceremonial grade matcha whisked with your choice of oat or almond milk over ice.', 
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    tags: ['Dairy-Free Option'],
    inStock: true
  },
]

export function NewFoodOrderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { placeOrder } = useOrderStore()
  
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [cart, setCart] = useState<{ menuItemId: string; name: string; quantity: number; unitPrice: number }[]>([])

  const filteredMenu = activeCategory === 'All Items' ? MOCK_MENU : MOCK_MENU.filter(m => m.category === activeCategory)

  const addToCart = (item: typeof MOCK_MENU[0]) => {
    if (!item.inStock) return;
    setCart(prev => {
      const existing = prev.find(p => p.menuItemId === item.id)
      if (existing) {
        return prev.map(p => p.menuItemId === item.id ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, unitPrice: item.price }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(p => p.menuItemId !== itemId))
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleSubmitOrder = () => {
    if (!user || cart.length === 0) return
    
    placeOrder({
      orderedById: user.id,
      items: cart,
      totalAmount,
      deliveryLocation: 'Desk - Level 3',
      notes: ''
    })
    
    navigate('/employee/food/tracking') // Assuming this is the tracking route
  }

  return (
    <div className="pt-8 pb-32 px-6 max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-3xl h-64 flex items-center bg-primary-container">
          <div className="absolute inset-0 opacity-40">
            <img alt="Gourmet Buffet" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200" />
          </div>
          <div className="relative z-10 px-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-white tracking-tight mb-2">Today's Menu</h1>
            <p className="text-primary-fixed font-medium max-w-md">Fuel your productivity with our chef-curated selections for HQ-Sector 4.</p>
          </div>
        </section>

        {/* Category Tabs */}
        <nav className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {MENU_CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary text-on-primary font-bold shadow-md' 
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenu.map(item => (
            <div key={item.id} className={`group flex flex-col bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 ${item.inStock ? 'hover:shadow-2xl hover:-translate-y-1' : 'opacity-75'}`}>
              <div className={`relative h-64 overflow-hidden ${!item.inStock ? 'grayscale' : ''}`}>
                <img alt={item.name} className={`w-full h-full object-cover transition-transform duration-500 ${item.inStock ? 'group-hover:scale-105' : ''}`} src={item.image} />
                {item.inStock ? (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="px-6 py-2 bg-error-container text-on-error-container font-black text-sm uppercase tracking-widest rounded-lg shadow-lg">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-headline text-on-surface">{item.name}</h3>
                  <span className={`text-lg font-bold ${item.inStock ? 'text-primary' : 'text-slate-400'}`}>${(item.price / 100).toFixed(2)}</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 flex-grow">{item.desc}</p>
                {item.inStock && (
                  <div className="flex items-center gap-2 mb-6">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.inStock ? (
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    Add to Cart
                  </button>
                ) : (
                  <button className="w-full py-4 bg-surface-container-highest text-outline font-bold rounded-xl cursor-not-allowed" disabled>
                    Coming Back Soon
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Promotion Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-cyan-900 to-cyan-700 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"></div>
            <div className="flex-1 z-10 text-center md:text-left">
              <span className="text-cyan-300 font-bold tracking-widest text-xs uppercase mb-2 block">Weekly Special</span>
              <h2 className="text-3xl font-extrabold font-headline text-white mb-4">Healthy Friday Buffet</h2>
              <p className="text-cyan-100/80 mb-6">Join us this Friday for a full organic spread. Exclusive for HQ employees. Pre-order now and save 15%.</p>
              <button className="px-8 py-3 bg-white text-cyan-900 font-bold rounded-xl shadow-xl hover:bg-cyan-50 transition-colors">Pre-order Special</button>
            </div>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl rotate-3 shrink-0">
              <img alt="Buffet Special" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&q=80&w=800"/>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full xl:w-96 shrink-0 z-40 hidden md:block">
        <div className="sticky top-24 bg-surface rounded-[2rem] shadow-xl overflow-hidden border border-outline-variant/10">
          <div className="bg-primary px-6 py-5 text-white flex justify-between items-center">
            <h3 className="font-bold font-headline text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">shopping_basket</span> Your Order
            </h3>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">{cartItemCount} Items</span>
          </div>
          
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">shopping_cart</span>
                <p className="text-on-surface-variant font-medium">Your tray is empty.</p>
                <p className="text-xs text-outline mt-1">Add items from the menu to start your order.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.menuItemId} className="flex justify-between items-start gap-4 p-4 rounded-xl bg-background border border-outline-variant/20">
                      <div className="flex-1">
                        <p className="font-bold text-on-surface text-sm">{item.name}</p>
                        <p className="text-primary font-bold mt-1">${(item.unitPrice / 100).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-on-surface text-sm">x{item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-dashed border-outline-variant/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-on-surface-variant text-sm font-medium">Subtotal</span>
                    <span className="text-on-surface font-bold">${(totalAmount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface font-bold text-lg">Total</span>
                    <span className="text-primary font-black text-2xl">${(totalAmount / 100).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full py-4 bg-tertiary-container text-on-tertiary-container font-bold rounded-xl active:scale-95 transition-transform hover:bg-tertiary-container/90 flex items-center justify-center gap-2 shadow-lg shadow-tertiary-container/20" 
                  onClick={handleSubmitOrder}
                >
                  Confirm & Pay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Cart Floating Action */}
      <div className="md:hidden fixed right-8 bottom-24 flex-col gap-4 z-50">
        <button 
          className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
          onClick={() => {
            // In a real app, this would open a mobile drawer with the cart
            if (cart.length > 0) handleSubmitOrder()
          }}
        >
          <span className="material-symbols-outlined">shopping_basket</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary-container text-on-tertiary-container text-[10px] font-black rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
