import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { VerifyOtpPage } from './pages/VerifyOtpPage.tsx'
import { ProductsPage } from './pages/ProductsPage.tsx'
import { ProductDetailsPage } from './pages/ProductDetailsPage.tsx'
import { CartPage } from './pages/CartPage.tsx'
import { OrdersPage } from './pages/OrdersPage.tsx'
import { OrderDetailsPage } from './pages/OrderDetailsPage.tsx'
import { AdminProductsPage } from './pages/admin/AdminProductsPage.tsx'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.tsx'
import { RequireAdmin } from './components/RequireAdmin.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailsPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-otp', element: <VerifyOtpPage /> },
      {
        path: 'admin/products',
        element: (
          <RequireAdmin>
            <AdminProductsPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'admin/orders',
        element: (
          <RequireAdmin>
            <AdminOrdersPage />
          </RequireAdmin>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
