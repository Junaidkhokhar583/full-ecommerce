import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getCurrentUser } from './lib/auth'

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 7h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2" />
      <path d="M9.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M17.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()
  const isAdmin = (user?.role ?? '').toUpperCase() === 'ADMIN'
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-semibold tracking-wide text-white">
            Mini E-Commerce
          </Link>

          <nav className="flex items-center gap-4 text-sm text-zinc-200">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-zinc-300 hover:text-white'
              }
              end
            >
              Products
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-zinc-300 hover:text-white'
              }
            >
              Orders
            </NavLink>

            {isAdmin ? (
              <>
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    isActive ? 'text-white' : 'text-zinc-300 hover:text-white'
                  }
                >
                  Admin Products
                </NavLink>
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    isActive ? 'text-white' : 'text-zinc-300 hover:text-white'
                  }
                >
                  Admin Orders
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <NavLink
              to="/cart"
              aria-label="Cart"
              title="Cart"
              className={({ isActive }) =>
                [
                  'group relative inline-flex h-9 w-9 items-center justify-center rounded-md border transition',
                  'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                  isActive ? 'text-white' : 'text-zinc-300 hover:text-white',
                ].join(' ')
              }
            >
              <CartIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
            </NavLink>

            {user ? (
              <>
                <span className="hidden text-xs text-zinc-400 sm:inline">
                  {user.email ?? 'Signed in'}
                </span>
                <button
                  className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900"
                  onClick={() => {
                    clearToken()
                    navigate('/login')
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {isHome ? (
          <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900/70 p-6 sm:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]" />
                  Fast checkout, modern feel. 
                </div>

                <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Shop smarter with a modern mini store.
                </h1>
                <p className="max-w-2xl text-pretty text-sm leading-6 text-zinc-300 sm:text-base">
                  Browse products, add to cart, and place orders with a smooth experience.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 motion-reduce:transition-none"
                    onClick={() => {
                      const el = document.getElementById('products-section')
                      if (!el) return
                      const y = el.getBoundingClientRect().top + window.scrollY - 12
                      window.scrollTo({ top: y, behavior: 'smooth' })
                    }}
                  >
                    Browse products
                  </button>
                  
                </div>
              </div>

              
            </div>
          </section>
        ) : null}

        <div id="products-section" className={isHome ? 'mt-6 scroll-mt-4' : undefined}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App
