import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importaciones lazy para code-splitting
const Home = () => import('@/views/client/Home.vue')
const Catalog = () => import('@/views/client/Catalog.vue')
const CarDetail = () => import('@/views/client/CarDetail.vue')
const Compare = () => import('@/views/client/Compare.vue')
const Favorites = () => import('@/views/client/Favorites.vue')
const Contact = () => import('@/views/client/Contact.vue')
const NotFound = () => import('@/views/client/NotFound.vue')

const AdminLogin = () => import('@/views/admin/Login.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminCarList = () => import('@/views/admin/CarList.vue')
const AdminCarForm = () => import('@/views/admin/CarForm.vue')
const AdminLeads = () => import('@/views/admin/Leads.vue')

const routes = [
  // Portal cliente
  { path: '/', name: 'Home', component: Home },
  { path: '/catalogo', name: 'Catalog', component: Catalog },
  { path: '/auto/:id', name: 'CarDetail', component: CarDetail },
  { path: '/comparar', name: 'Compare', component: Compare },
  { path: '/favoritos', name: 'Favorites', component: Favorites },
  { path: '/contacto', name: 'Contact', component: Contact },

  // Admin
  { path: '/admin', name: 'AdminLogin', component: AdminLogin },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/autos',
    name: 'AdminCarList',
    component: AdminCarList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/autos/nuevo',
    name: 'AdminCarNew',
    component: AdminCarForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/autos/:id',
    name: 'AdminCarEdit',
    component: AdminCarForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/leads',
    name: 'AdminLeads',
    component: AdminLeads,
    meta: { requiresAuth: true }
  },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// Guard de autenticación para rutas admin
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    // Verifica la sesión en el servidor si aún no se ha inicializado
    await auth.init()
    if (!auth.isAuthenticated) {
      return next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    }
  }
  next()
})

export default router
