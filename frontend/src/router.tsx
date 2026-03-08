import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import About from './pages/About'
import Certificates from './pages/Certificates'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'
import AdminRoute from './components/auth/AdminRoute'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductList from './pages/admin/AdminProductList'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategoryList from './pages/admin/AdminCategoryList'
import AdminSettings from './pages/admin/AdminSettings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'about', element: <About /> },
      { path: 'certificates', element: <Certificates /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'profile', element: <Profile /> },
      { path: 'terms', element: <ComingSoon /> },
      { path: 'privacy', element: <ComingSoon /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProductList /> },
      { path: 'products/new', element: <AdminProductForm /> },
      { path: 'products/:id/edit', element: <AdminProductForm /> },
      { path: 'categories', element: <AdminCategoryList /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
])
