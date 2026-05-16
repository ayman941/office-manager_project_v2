import { useState } from 'react'
import { useMenuStore, MenuCategory } from '@/features/canteen/stores/useMenuStore'
export function MenuManagementPage() {
  const { items, toggleStock, deleteItem } = useMenuStore()
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast')

  const filteredItems = items.filter(item => item.category === activeCategory)

  const categories = [
    { name: 'Breakfast', icon: 'wb_sunny', count: 4 },
    { name: 'Lunch', icon: 'restaurant', count: 12 },
    { name: 'Snacks', icon: 'coffee', count: 8 },
    { name: 'Drinks', icon: 'local_bar', count: 24 }
  ] as const

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header Section with Bento Elements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Date Selector */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl h-64 flex flex-col justify-end p-8 text-on-primary">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Hero background" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/ADBb0uhen8AM2pLtlEqOvR_arpVLGTht7-EPzV4RhsqiI45EHavfWBGtGHLhy5wojbSgFp9N3FMwBeJ7brkxPq6SH_o17_DN2TnM7mkx_v8G8VN-uRsxRFlgO-RZaQcA86nGKX2jHZQbQSmXmL1qyOoGutgcaOwJjhgSXEPvYsx2rVJp4V42qoyaWIPGMoV6R5VfIozojKpPwqocAjVIv3bYlWr9CaLXb9tGtznuN5ICzeJGmgJugn-bMH8YirOR3ufNl_5JhQcjkvTcTEw" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <span className="text-primary-fixed font-bold tracking-widest text-xs uppercase">Planner Overview</span>
            <h2 className="font-display text-4xl font-extrabold mt-1">Weekly Culinary Schedule</h2>
            <p className="text-primary-fixed/80 mt-2 max-w-md">Manage nutrient-balanced menus for the executive team and staff. Ensuring peak performance through better nutrition.</p>
          </div>
        </div>

        {/* Quick Stats Bento Card */}
        <div className="bg-primary-container rounded-xl p-6 flex flex-col justify-between border-none shadow-sm">
          <div className="flex justify-between items-start">
            <div className="bg-on-primary-container/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-on-primary-container">trending_up</span>
            </div>
            <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full text-[10px] font-bold">12% GROWTH</span>
          </div>
          <div>
            <div className="text-on-primary-container/60 text-sm font-medium">Predicted Orders Today</div>
            <div className="text-3xl font-display font-extrabold text-on-primary-container mt-1">482 Meals</div>
          </div>
          <div className="pt-4 border-t border-on-primary-container/10">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border border-primary-container object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8JRSuq4WRxS5tSTxCLQnVTaOPVJXpjPVJoN2O6pOYMSw82ncNDrzO7pLlE2A21Ne8JxzlQT97Qn-JFCPTAWW4SlOWp_zWomtbhSCqInme5C7IP-wQe0032Eo9N3Cg51saOz_-dO0jzL4B6OrNG0VTRbz1o8elclYtgB3AAD-2947d3QB536GDN2UWr_QqCPCN7mQfpezXZ9CRGe31siRsi8G3qfzFWNZbER6HAlF-T1mcMHqpkVn_nVSNLqWux_COs1FbiosS8e6O" alt="Avatar" />
              <img className="w-6 h-6 rounded-full border border-primary-container object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVVLOnvzihP79kDybsPtEK3r_csTmMs1gHvaWUaCmFZ1rcnsI8hbWzXpDTMQF9R4IrhpVSLN1KMG8hrXtJpvx5QnTv0qIYjqbkIHs_hgvzKBSmPUlLCoDbRybJ9ySOBml2xm8IaRNA3Q-ZC0t2tztkoOT4TH8g-W86VF07BrcvgYBUc96zhjob1CguP2KgUL6A8xA2QPELCkayMIJ9A3WnZsYt9e7hHWpek_BTqKCJ6w9Gi_ls3ndyg1l-tALp5XRupNTvKpjIKAXm" alt="Avatar" />
              <div className="w-6 h-6 rounded-full border border-primary-container bg-surface-container-highest flex items-center justify-center text-[8px] font-bold">+15</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Navigation */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-xl shadow-sm">
          <button className="px-6 py-2 rounded-lg bg-surface-container-lowest text-primary font-bold shadow-sm transition-all duration-300">Daily</button>
          <button className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">Weekly</button>
          <button className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">Monthly</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 className="font-headline font-bold text-lg px-4">Thursday, 24 October</h3>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-primary font-semibold hover:bg-surface-container-highest transition-all shadow-sm">
            <span className="material-symbols-outlined">filter_list</span>
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Add Item</span>
          </button>
        </div>
      </section>

      {/* Menu Grid Section (Asymmetric Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-6">Meal Types</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name as MenuCategory)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeCategory === cat.name 
                      ? 'bg-surface-container-lowest text-primary font-bold border border-primary/10 shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                    {cat.name}
                  </span>
                  <span className={activeCategory === cat.name ? "bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full" : "bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full"}>
                    {cat.count} Items
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Inspiration Card */}
          <div className="relative rounded-2xl overflow-hidden group shadow-md">
            <img 
              alt="Chef Recommendation" 
              className="w-full h-80 object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida/ADBb0uiUBUr7HQk35x2CrjkvzdlFM_MkJZKiO2pdbtSdXYy2H_oyX065M1YNXzNgbeaVVvDe-TPtMWFN_XmLmV3DdtaFHFNBjUDDAqFHOMkLr8uq1G5XBwsg34Y88MTjec4GNgbosCxJB9f_fXhNI3ITHIRZ9AOuHN_1YMmaZIjEylCc9nhIjAE_naLq5W_cdIy86F4k9PX3V5spcw4CmvtfsT6LYPq88Jo2GbJeQUb8Wt7z07i1sUZr225A4wdyZzJtI3mhXx_4sVsdNA" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-on-primary">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Chef's Choice</p>
              <h5 className="text-xl font-bold mt-1">Avocado Truffle Sourdough</h5>
              <button className="mt-4 text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                View Recipe <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Menu Items Canvas */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-surface-container-lowest rounded-2xl p-5 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col gap-4 shadow-sm border border-outline-variant/10">
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={item.imageUrl} />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-error hover:bg-error hover:text-white transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h4>
                  <span className="font-headline font-extrabold text-primary">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-secondary' : 'bg-error'}`}></span>
                  <span className={`text-xs font-semibold uppercase ${item.inStock ? 'text-secondary' : 'text-error'}`}>
                    {item.inStock ? 'Available' : 'Stock Out'}
                  </span>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={item.inStock} 
                    onChange={() => toggleStock(item.id)} 
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-xs font-medium text-on-surface-variant">
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </label>
              </div>
            </div>
          ))}

          {/* Placeholder/Add New Card */}
          <button className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-center gap-4 group hover:bg-surface-container-high hover:border-primary transition-all duration-300 min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
            </div>
            <div className="text-center">
              <h4 className="font-headline font-bold text-lg">Add New Dish</h4>
              <p className="text-on-surface-variant text-sm">Expand your {activeCategory.toLowerCase()} menu</p>
            </div>
          </button>

        </div>
      </section>
    </div>
  )
}
