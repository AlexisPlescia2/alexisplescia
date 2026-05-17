import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper'
import AdminRoute from './components/auth/AdminRoute'
import DashRoute from './components/auth/DashRoute'

// Eagerly loaded (critical path — the shell + home are fast)
import Home from './pages/Home'

// Lazy-loaded routes (non-critical or heavy)
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Certificates = lazy(() => import('./pages/Certificates'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Heavy admin chunk
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))
const AdminCategoryList = lazy(() => import('./pages/admin/AdminCategoryList'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))

// Dash — heavy due to Recharts
const DashView = lazy(() => import('./pages/dash/DashView'))

// Blank fallback — avoids flash of spinner during route transitions
const BlankFallback = () => <div className="min-h-screen" />

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'shop',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <Shop />
          </Suspense>
        ),
      },
      {
        path: 'product/:slug',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'certificates',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <Certificates />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <ComingSoon />
          </Suspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <ComingSoon />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/dash',
    element: (
      <DashRoute>
        <Suspense fallback={<BlankFallback />}>
          <DashView />
        </Suspense>
      </DashRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Suspense fallback={<BlankFallback />}>
          <AdminLayout />
        </Suspense>
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminProductList />
          </Suspense>
        ),
      },
      {
        path: 'products/new',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminProductForm />
          </Suspense>
        ),
      },
      {
        path: 'products/:id/edit',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminProductForm />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminCategoryList />
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminMessages />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<BlankFallback />}>
            <AdminSettings />
          </Suspense>
        ),
      },
    ],
  },
])
