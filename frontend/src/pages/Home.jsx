import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const Home = () => {
  const { addItem, cartItems } = useCartStore();
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const popularItems = [
    {
      id: "p1",
      title: "Margherita Classica",
      desc: "San Marzano tomatoes, mozzarella, fresh basil.",
      price: 12.99,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuASG-I5m3bVdMO1WvnT9kATEtpzQeOBrw0YtAg7BZJkdheAvlKAMHDYHVuy7tllep9LaS7GKIEMjoMHphpy7hP4QQo_EuK9MwNOqe0L_vbVgEFeYhcFSAwSIhDB3jUG_em89-w8eRJ1nmZB2Cd9t8PtRDp3_7CJuuCVCupZjYfuUPmn0SSVjNkrPNVJUYibTORzhB-FutPFNnUfntaKXgqQJKKWTlry6k8jlzWGXAUbFbxAX284HnojRyLOsE_59CUkFVFj_rXOeSXm"
    },
    {
      id: "p2",
      title: "Mamma's Lasagne",
      desc: "Layered pasta with beef ragu and béchamel.",
      price: 14.50,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNsHi4Bp27euYg9_NhtOZyAjskxHL4oHnmWH_12CiF5miSqE-DHFymaxR_R0Psg-JXaAnPWzR6cdFOF7iY6XG8qvl5Enj35J4VAm7gf50dA-CgzCC9JftE0xHQlg9LEyl7-Bm7fd3_bdI1gN-cs3hCN89llThJEkkMdRMgGr7ceDcwDwa28kuFpXk6C25dClWJtiwixrvma1kz86M8SOltPdOW2NGfWL4ZXxzlMe68gWbChQNl9YW0-csWNeFqj8l6vTvOmTzAlBl-"
    },
    {
      id: "p3",
      title: "Quinoa Power Bowl",
      desc: "Grilled chicken, quinoa, and fresh greens.",
      price: 11.25,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClg4KiIRbXMzEt3WAsIrL2v3EE92ZqnFbsFfi1VjxwkjxjMjsSmYVYoVYt2_xnxnX3F6x-_W16WwpRQtYkPIpwbDVOc5D9E2rG-7bwv7-w0Zs8aTPTFCwe7giYLKvWmEVXFlVYfO5-FKusjBtGqvbhl_hHpO2V1gJHYksr4bIB-uWP7EKqOuZ78HeQTkY3AQjl_sufAvKVz09q5oDl1uk0WY8FxPD0iXUTvnhKvOpDLcxn8j6HrPFtAlsGaS_7IHpBdqyENgCn4tCd"
    },
    {
      id: "p4",
      title: "Midnight Donut",
      desc: "Triple chocolate glazed artisan donut.",
      price: 4.99,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsxYXEIqAkZvv9XFDvPvRUqninRPwfTUaSkrZByZ1igQSAWRes6iyAfGECyf_jFJbjBZnyHwphQMBFXHShoJEJ1ONtdNrxZYgk7E5asURjMOeUGMW7CgYxqu81nTg1M-g1qKrvKMQty0ReSoKd5jnvfGTrElkg7L1Ug23p2xzwGdFA_s09mWDXSNj30bKwEP9y5n6F4oittuoQBRjwpm9HaVTKPPqGkvekecKvv7KBFjM4pHcs7-Ml2kzckd50eum8xXCYVLnF5I7k"
    },
    {
      id: "p5",
      title: "Rustic Tomato Soup",
      desc: "Served with sourdough croutons.",
      price: 8.00,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmAZOTsLjTiknmAWPLYXjh2B_JIeMPRkH-sR14vrsPM8O41aJ8eTdZDA0aC89C4mLIvU58-3QlYNXNN0FFLvoMIa8zJgflEemtM8ayljsdrJWWxDXG7ZyCXL7mNsakRbsagdmWMpyuY1mKgEsv4iVMSxGHhiqyPV9weWeUNQEPLUbWdUMerVgbwMahLZLIcani7DE5gXzucEueBWQOiDQHYL93ixfAZ7P5O8WadBRr8c5YmhgnoAcNXMvgLzM6ATfmEsm5oXGvb--o"
    },
    {
      id: "p6",
      title: "The Boss Burger",
      desc: "Double patty, triple cheese, smoked bacon.",
      price: 15.99,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeFTp4slLxZYgthsk76NdOllmRaUwtLh1aSS3tXxBaJg1hY6EYxFCFtpkSyb45vmLFyLS3KDPR7DE1fxaFWqzYGpH_OlzAqLEsA0kMv18Rxr93rRdFd9UGzgoIKmRfMEd7ioJ3GXIo75ZCJJpDpxPDUZp78N26laQv-2UfFZGyJ9684KzlKv-gtJ-qnHIRV6Sdp5WmjBiUgN0A9gsVe-JvbsILlApvtIVa4RmlfvELbJEdBzmh-poTMC5t5rxchwPlIx686mfqyUcu"
    }
  ];

  const handleAddItem = (item) => {
    addItem({
      id: item.id,
      name: item.title,
      price: item.price,
      img: item.img
    });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">restaurant</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">ABC RESTO</h1>
        </div>
        <div className="flex-1 max-w-2xl mx-auto">
          <label className="relative block w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 text-sm" 
              placeholder="Search for food, drinks..." 
              type="text" 
            />
          </label>
        </div>
        <div className="relative flex items-center justify-end shrink-0">
          <Link to="/cart" className="p-2 hover:bg-primary/10 rounded-full relative transition-colors">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-24">
        <section className="mb-8">
          <div className="px-4 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Today's Specials</h2>
            <a className="text-primary text-sm font-medium" href="#">View All</a>
          </div>
          <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar">
            {[
              {
                id: "s1",
                title: "Pepperoni Feast",
                desc: "Classic wood-fired pizza",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9q2xQqt5FZgBY8UMv07jfQuwTSRbkg3CaCC0VCjlQYUVCo90xp8CBebIM8EemCuyZI1y9n9Lj8249fGaPIyC24uhJOODWglOXpqHa-1s9qGds7LEnpxfB77F2Yscxzg7CisMEKdIuFxsfB43uRoVajOya4NXAP9_49z3CgXDQ8WdvMF3LbxV1oBAtF1Bg8Cvk0KOWkQB3aSlSk3JuJ10emRgsnBL4K053DXzo1gLvmnvr5Bz-7dPepCB8X_X0t7OOYlWCW6NQNtM7",
                discount: "20% OFF",
                price: 15.99
              },
              {
                id: "s2",
                title: "Double Wagyu",
                desc: "Premium aged beef patties",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe97ZznopQc4sLcXhvkh3TNhA4CDcchjexLzwfpFUbbnxfJ_lKSfikcrXKsQnWA_KgaZ_QBMZH_HJwuCdbJ-XWUz-eFCOdQw2y9U2a3oZuY9vUqh9hFs1jr3udsgqit7tndwPrMApARhNtk0SQpcG9G7Q5yVf97lX1E6BuSeVky19PsmYbgrKD5umV60AVS1TV0c6sMlfYHculdYxgAB1miyHGN0hNXo9zx8z6Jnj3gdT3BEvq5MF5xuI8BUIF0ltXVx7WWIyU3Zzt",
                discount: "20% OFF",
                price: 22.50
              },
              {
                id: "s3",
                title: "Avocado Zen",
                desc: "Healthy superfood bowl",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs9Y_34yOnk7cTFPKmxPp9pshWV_bk8WqcXR9EbS9BeACLSpqc7DiJ-Me2JezoM7mw22oDyHCSSGysZ2k9fpkytA9g-JXYRstrIubl1mZ8zXyPRXDmHFMuoKwAdgmJ2xi9gvMqpnXuSXt4VPFcF-PAqAorkfa8Jobl9McAgkRHJNvNrJciAy6qDABKFqgqPkK2m7obEs_aD0u3-pDp1USwU-qdcvuiy9xhA5PvlFeB3CoBafCCk3Ku2vl3kF9FbFmKJIO9C6JIAxu1",
                discount: "20% OFF",
                price: 13.00
              }
            ].map((item) => (
              <div 
                key={item.id} 
                className="flex-none w-72 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-95 transition-transform"
                onClick={() => handleAddItem(item)}
              >
                <div 
                  className="h-40 bg-cover bg-center relative" 
                  style={{ backgroundImage: `url('${item.img}')` }}
                >
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">{item.discount}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 overflow-hidden">
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
            {["All", "Pizza", "Burgers", "Salads", "Drinks", "Desserts"].map((cat, idx) => (
              <button 
                key={cat}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  idx === 0 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4">
          <h2 className="text-xl font-bold mb-4">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularItems.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl flex gap-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <div 
                  className="w-24 h-24 bg-cover bg-center rounded-lg shrink-0" 
                  style={{ backgroundImage: `url('${item.img}')` }}
                ></div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h4 className="font-bold leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddItem(item)}
                      className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold min-h-[44px] hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg">
        <div className="flex max-w-2xl mx-auto items-center justify-around py-2 px-4 shadow-xl">
          <Link to="/" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
          </Link>
          <Link to="/my-orders" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

