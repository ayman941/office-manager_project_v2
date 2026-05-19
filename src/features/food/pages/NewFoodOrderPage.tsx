import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { useOrderStore } from '../stores/useOrderStore'
import { MenuItem } from '@/types'
import { ShoppingBasket, Check, ArrowRight, Ban, Plus, Trash2, X } from 'lucide-react'

const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Artisan Avocado Toast',
    description: 'Sourdough bread topped with mashed avocado, organic poached eggs, and a dash of red pepper flakes.',
    price: 850,
    category: 'Breakfast',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXObEStfwR2U9Gjrl6q1GCogeo2YHGcbZ8MaTcLooYtSXKhwPl6w6b1b_xGdh5H94Za09s-xONDP6jQ86zHdJ6gA3zcV83ohiLUHgGXrDdl57z7SIE8iQp_GUI8CSEw4hm9EYJOv4pNFKEh5r_QOq9_RomTozOJHMpYhFvp7DjuvFb00Acv0Vaz8tgWA8mKouz1vbLeBEAzIHho30p0isZ6bDI8MDRC6QiG9If4UJJwyUaWDhkRpDeO23NgjeuOs_m2haK3YalBrA',
    isAvailable: true,
  },
  {
    id: 'm2',
    name: 'Tropical Smoothie Bowl',
    description: 'Dragon fruit and banana base with house-made honey granola and seasonal fresh berries.',
    price: 600,
    category: 'Breakfast',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE_7GsD86AUesA3V7IApguhunrBT-U8qZ160JnSUwjB2dUlEruShkgAnlOYu_PYZKLOeHeO9sogee23uJigTCzZZYxbk8AcBTwuLJ4M68SmiEeNf-6XRLwDAw4oYB4ilQiSdoprIxwO_Hf1zFRIWwHoobPiUdUr9vqTYVumKc29fhxFvoEC-pqf6lLHPvdvddUwSuS3xkwxAUkEoIKg-VAPCjgQK3ZYFdPd2tDvUngf_uYXGUD0z-ZH-xA3CKZO4PowO3h4GQH1e0',
    isAvailable: true,
  },
  {
    id: 'm3',
    name: 'Miso Glazed Salmon Bowl',
    description: 'Sustainably sourced salmon fillet with miso honey glaze, served over quinoa with charred broccoli and pickled ginger.',
    price: 1495,
    category: 'Lunch Specials',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC62OfEyzD88bGm_TSa-2Bu7DtFHaM71X0LdUUt1xVW5Jt_x_NEuNSGud8X8Gkuamo6qVYTWipjX8Bd7Qc_AmvTSJNnrWmkWwNcrAuWcHdN5A6rfO_Yfo5P5iEmh-bYGjZ-HajctSPQrEMCiCLXbqG5SWInq8y-hrOh_Xsf5QWgKObBa-HSgymwWd0xS__6rq7ErspvomB9HHaZ8NWojbILEiirWVjOCAP432dua_pVwMctZvf92AZmoHB1S75JYoPyI3NTb1LgQso',
    tags: ['Gluten Free', '480 kcal'],
    isAvailable: true,
    isChefSpecial: true,
  },
  {
    id: 'm4',
    name: 'Signature Wagyu Burger',
    description: 'Wagyu beef patty, aged cheddar, caramelized onions, and truffle aioli on a brioche bun.',
    price: 1600,
    category: 'Lunch Specials',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6WKFTc04C_0SKbOmjv1BTj4KtqLT18127pKBf-eScikKz7Cy2vsZeho2-6bAbSZm6C4QDhsLYJE1m00c_81Jn_0h5EBuLbfHEXmSwfX-ZspK5szr19s1XwrWtFm-pbPszo_urlsjIbEDnCeglgcSHiSFJk5nHCxlAwrDmPMRzpnVMmqCAl5QYywhQx2q463rG_KbYLDfnz10J4Bw4GflsoS9IB4NnQ6wqlAzDcdzMvwUHDD_RJ5Zh6bJHoOTnxm1MQ629Fra6HM4',
    isAvailable: false,
  },
  {
    id: 'm5',
    name: 'Cold Brew with Oat Milk',
    description: 'A cold brew coffee with swirling cream.',
    price: 450,
    category: 'Snacks & Drinks',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvIUcd5HfgO86yBdSI-NKoRV8cUh4rXjRvoEgcwe6PFR26aQAENUl2w2bffACl_2sLCWqdJonf0W2fV1r2T96Nps9_4uIqUHATU8DHpX2qjUCLL-U-WQlWu40BxJUWazaclSOpnfWbSu2tYoelNCiAm4nE_fa_HymKDBf7nf34rkafubKShBtJ1ixyuWDg-jXlal7UzZBK3t4R2Aqfy3_sMqpjKRKvrVau1xECo21fWT4wjih3mX9LnzvT_X2yzXjjIgCanjGQokM',
    isAvailable: true,
  },
  {
    id: 'm6',
    name: 'Almond & Date Power Bar',
    description: 'A gourmet energy bar featuring whole almonds, dates, and dark chocolate chunks.',
    price: 325,
    category: 'Snacks & Drinks',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWqfBNgqeN3v5YtwPra241zDkq8LDdCPFJCTn-NxClOQJBdRblB1bAkt2KuGYfpduT4SNM_f4i7SatXW6JHGQ8vkumIwlsHRyDS7zcygeqU7WNuULWEHJOnSGV-FE6B74sIeTFzo4NIU6-inF1HJLrgW5pm21jXLIqOQzzpAxyoD5zn1qhfMtPUAf98VHxesAxdv8eoL4HbJbvwmRoVeW-k-VNJae0Q443ZyDLU63XPM2M9RNz3bQdWBPTtFSVx3Zp6LlFVWinw5k',
    isAvailable: true,
  }
]

export function NewFoodOrderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { placeOrder } = useOrderStore()
  
  const [cart, setCart] = useState<{ menuItemId: string; name: string; quantity: number; unitPrice: number }[]>([])
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== id))
  }

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart(prev => {
      const existing = prev.find(p => p.menuItemId === item.id)
      if (existing) {
        return prev.map(p => p.menuItemId === item.id ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, unitPrice: item.price }]
    })
    
    // Provide feedback
    setAddedItemFeedback(item.id)
    setTimeout(() => {
      setAddedItemFeedback(null)
    }, 1500)
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleSubmitOrder = () => {
    if (!user || cart.length === 0) return
    
    placeOrder({
      orderedById: user.id,
      items: cart,
      totalAmount,
      deliveryLocation: 'Desk - Level 3', // Assuming a default or picked up from profile
      notes: ''
    })
    
    navigate('/employee/orders')
  }

  const renderSection = (title: string, time: string, items: MenuItem[]) => (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-bold font-headline text-primary">{title}</h2>
        <div className="h-px flex-1 bg-outline-variant/30"></div>
        {time && <span className="text-xs font-bold text-outline tracking-widest uppercase">{time}</span>}
      </div>
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
        {items.map(item => {
          const isAdded = addedItemFeedback === item.id;
          
          return (
            <div key={item.id} className={`group bg-surface rounded-xl overflow-hidden transition-all duration-300 border border-transparent shadow-card hover:shadow-card-hover ${item.isChefSpecial ? 'desktop:col-span-2 flex flex-col tablet:flex-row' : 'flex flex-col'} ${!item.isAvailable ? 'opacity-80' : ''}`}>
              
              <div className={`relative overflow-hidden ${item.isChefSpecial ? 'w-full tablet:w-1/2 h-64 tablet:h-full' : 'h-48'} ${!item.isAvailable ? 'grayscale' : ''}`}>
                <img alt={item.name} src={item.imageUrl} className={`w-full h-full object-cover transition-transform duration-700 ${item.isAvailable ? 'group-hover:scale-105' : ''}`} />
                {item.isChefSpecial && (
                  <div className="absolute bottom-4 left-4 bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Chef's Special
                  </div>
                )}
                {!item.isAvailable ? (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-surface px-4 py-2 rounded-full text-xs font-bold text-on-surface uppercase tracking-widest shadow-lg">Out of Stock</span>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    ${(item.price / 100).toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className={`p-6 flex flex-col flex-1 ${item.isChefSpecial ? 'w-full tablet:w-1/2' : ''}`}>
                <h3 className={`text-lg font-bold mb-2 ${!item.isAvailable ? 'text-outline' : 'text-on-surface'}`}>{item.name}</h3>
                <p className={`text-sm line-clamp-2 mb-6 ${!item.isAvailable ? 'text-outline-variant' : 'text-on-surface-variant'}`}>{item.description}</p>
                
                <div className="mt-auto space-y-4">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-background text-on-surface-variant text-[10px] font-bold rounded uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => addToCart(item)}
                    disabled={!item.isAvailable}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${!item.isAvailable ? 'bg-surface-container-highest text-outline cursor-not-allowed shadow-none' : isAdded ? 'bg-success text-surface' : 'bg-primary text-surface hover:bg-primary/90'}`}
                  >
                    {!item.isAvailable ? (
                      <><Ban size={16} /> Unavailable</>
                    ) : isAdded ? (
                      <><Check size={16} /> Added</>
                    ) : (
                      <><Plus size={16} /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )

  const renderSmallItems = (title: string, items: MenuItem[]) => (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-bold font-headline text-primary">{title}</h2>
        <div className="h-px flex-1 bg-outline-variant/30"></div>
      </div>
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-6">
        {items.map(item => {
          const isAdded = addedItemFeedback === item.id;
          
          return (
            <div key={item.id} className="group bg-surface rounded-xl p-4 transition-all hover:shadow-card-hover shadow-card border border-transparent">
              <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                <img alt={item.name} src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col h-[calc(100%-11rem)] justify-between">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-on-surface line-clamp-1">{item.name}</h4>
                  <p className="text-primary font-bold text-sm mb-4">${(item.price / 100).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className={`mt-auto w-full py-2 border-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 active:scale-95 ${isAdded ? 'bg-success text-surface border-success' : 'border-primary/10 text-primary hover:bg-primary hover:text-surface'}`}
                >
                  {isAdded ? <Check size={14} /> : <Plus size={14} />} {isAdded ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )

  return (
    <div className="relative min-h-screen pb-32">
      <div className="p-4 tablet:p-8 space-y-4 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-on-surface font-headline">Food Menu</h1>
          <p className="text-sm text-outline font-medium">Daily Curation</p>
        </header>

        {renderSection('Breakfast', '08:00 - 10:30 AM', MOCK_MENU.filter(m => m.category === 'Breakfast'))}
        {renderSection('Lunch Specials', '12:00 - 02:30 PM', MOCK_MENU.filter(m => m.category === 'Lunch Specials'))}
        {renderSmallItems('Snacks & Drinks', MOCK_MENU.filter(m => m.category === 'Snacks & Drinks'))}
      </div>

      {cartItemCount > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 desktop:left-auto desktop:right-12 desktop:translate-x-0 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setShowCart(true)}
            className="bg-primary text-surface px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(14,94,111,0.3)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="relative">
              <ShoppingBasket size={24} />
              <span className="absolute -top-1 -right-1 bg-secondary w-2 h-2 rounded-full border border-surface"></span>
            </div>
            <span className="font-bold tracking-tight">Review Order (${(totalAmount / 100).toFixed(2)})</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 tablet:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline text-on-surface flex items-center gap-2">
                <ShoppingBasket size={24} className="text-primary" /> Review Order
              </h2>
              <button onClick={() => setShowCart(false)} className="p-2 text-outline hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-highest">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-on-surface-variant">Your cart is empty.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.menuItemId} className="flex justify-between items-center gap-4 p-4 rounded-xl border border-outline-variant/20">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-on-surface">{item.name}</p>
                        <p className="text-primary font-bold mt-1">${(item.unitPrice / 100).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-on-surface-variant px-2">x{item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="p-2 text-critical hover:bg-critical/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface-variant font-medium">Total</span>
                <span className="text-2xl font-black text-primary">${(totalAmount / 100).toFixed(2)}</span>
              </div>
              <button 
                onClick={handleSubmitOrder}
                disabled={cart.length === 0}
                className="w-full py-3 bg-primary text-surface font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
