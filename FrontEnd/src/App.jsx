import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import InstructorRoute from './components/layout/InstructorRoute'
import ScrollToTop from './components/layout/ScrollToTop'
import StudentRoute from './components/layout/StudentRoute'

import Home from './pages/public/Home'
import Nosotros from './pages/public/Nosotros'
import Faq from './pages/public/Faq'
import Guia from './pages/public/Guia'
import Contacto from './pages/public/Contacto'
import NotFound from './pages/public/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProductList from './pages/shop/ProductList'
import ProductDetail from './pages/shop/ProductDetail'
import Cart from './pages/shop/Cart'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import LessonView from './pages/courses/LessonView'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/dashboard/Profile'
import Certificates from './pages/dashboard/Certificates'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCourses from './pages/admin/AdminCourses'
import AdminOrders from './pages/admin/AdminOrders'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import InstructorCourses from './pages/instructor/InstructorCourses'
import InstructorCourseDetail from './pages/instructor/InstructorCourseDetail'
import InstructorStudents from './pages/instructor/InstructorStudents'

import './styles/custom.css'

function App() {
  useEffect(() => {
    const defaultTitle = document.title
    const awayTitle = 'Volvé a FuthurTech'

    const handleVisibilityChange = () => {
      document.title = document.hidden ? awayTitle : defaultTitle
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.title = defaultTitle
    }
  }, [])

  return (
    <ToastProvider>
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/guia" element={<Guia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/productos" element={<ProductList />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/cursos" element={<CourseList />} />
              <Route path="/cursos/:id" element={<CourseDetail />} />
              <Route path="/cursos/:courseId/leccion/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/certificados" element={<StudentRoute><Certificates /></StudentRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
                <Route path="usuarios" element={<AdminUsers />} />
                <Route path="cursos" element={<AdminCourses />} />
                <Route path="pedidos" element={<AdminOrders />} />
              </Route>
              <Route path="/instructor" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>}>
                <Route path="cursos" element={<InstructorCourses />} />
                <Route path="cursos/:id" element={<InstructorCourseDetail />} />
                <Route path="estudiantes" element={<InstructorStudents />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
    </ToastProvider>
  )
}

export default App
