import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('[seed] Iniciando seed de base de datos...')

  // Categorías de proyectos
  const webApps = await prisma.category.upsert({
    where: { slug: 'web-apps' },
    update: {},
    create: { name: 'Aplicaciones Web', slug: 'web-apps', image: 'https://picsum.photos/seed/webapps/400/300' },
  })
  const dataAnalysis = await prisma.category.upsert({
    where: { slug: 'data-analysis' },
    update: {},
    create: { name: 'Análisis de Datos', slug: 'data-analysis', image: 'https://picsum.photos/seed/dataanalysis/400/300' },
  })
  const dashboards = await prisma.category.upsert({
    where: { slug: 'dashboards' },
    update: {},
    create: { name: 'Dashboards & KPIs', slug: 'dashboards', image: 'https://picsum.photos/seed/dashboards/400/300' },
  })
  const backend = await prisma.category.upsert({
    where: { slug: 'backend' },
    update: {},
    create: { name: 'Backend & APIs', slug: 'backend', image: 'https://picsum.photos/seed/backend/400/300' },
  })
  const automatizacion = await prisma.category.upsert({
    where: { slug: 'automatizacion' },
    update: {},
    create: { name: 'Automatización', slug: 'automatizacion', image: 'https://picsum.photos/seed/automatizacion/400/300' },
  })
  const ecommerce = await prisma.category.upsert({
    where: { slug: 'ecommerce' },
    update: {},
    create: { name: 'E-Commerce', slug: 'ecommerce', image: 'https://picsum.photos/seed/ecommerce/400/300' },
  })
  const mobile = await prisma.category.upsert({
    where: { slug: 'mobile' },
    update: {},
    create: { name: 'Mobile & Responsive', slug: 'mobile', image: 'https://picsum.photos/seed/mobile/400/300' },
  })
  const devops = await prisma.category.upsert({
    where: { slug: 'devops' },
    update: {},
    create: { name: 'DevOps & Deploy', slug: 'devops', image: 'https://picsum.photos/seed/devops/400/300' },
  })
  const iaDatos = await prisma.category.upsert({
    where: { slug: 'ia-datos' },
    update: {},
    create: { name: 'IA & Datos', slug: 'ia-datos', image: 'https://picsum.photos/seed/iadatos/400/300' },
  })
  const otros = await prisma.category.upsert({
    where: { slug: 'otros' },
    update: {},
    create: { name: 'Otros Proyectos', slug: 'otros', image: 'https://picsum.photos/seed/otros/400/300' },
  })

  console.log('[seed] ✓ 10 categorías creadas')

  // Proyectos
  const proyectos = [
    {
      name: 'Prometeo Tattoo — E-commerce',
      slug: 'prometeo-tattoo-ecommerce',
      description: 'E-commerce full stack para tienda de insumos de tatuajes. React + Vite + Node.js + Express + Prisma + PostgreSQL. Deploy en Railway (backend) y Vercel (frontend). Carrito, checkout, panel admin y pagos con MercadoPago.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/ecommerce1/600/450'],
      brand: 'React · Node.js · PostgreSQL · MercadoPago',
      featured: true,
      categoryId: webApps.id,
    },
    {
      name: 'Armería Sniper — E-commerce',
      slug: 'armeria-sniper-ecommerce',
      description: 'Fork y rebranding de e-commerce para armería deportiva. Stack idéntico al anterior, adaptado para otro rubro. Deploy en VPS Hostinger con Nginx + PM2.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/armeria1/600/450'],
      brand: 'React · Node.js · Nginx · PM2',
      featured: true,
      categoryId: ecommerce.id,
    },
    {
      name: 'Dashboard KPIs — Carrefour',
      slug: 'dashboard-looker-carrefour',
      description: 'Dashboards interactivos en Looker Studio para seguimiento de KPIs de consumo eléctrico, eficiencia energética y desempeño operativo a nivel nacional. Más de 500 locales monitoreados.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/dashboard1/600/450'],
      brand: 'Looker Studio · Google Sheets · Excel',
      featured: true,
      categoryId: dashboards.id,
    },
    {
      name: 'App de Gestión de Tareas',
      slug: 'task-manager-flask-react',
      description: 'Aplicación web de gestión de tareas desarrollada en Talento Tech. Backend en Flask (Python) con API REST, frontend en React. Autenticación JWT, CRUD completo y Docker.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/taskmanager/600/450'],
      brand: 'Flask · React · Docker · PostgreSQL',
      featured: false,
      categoryId: webApps.id,
    },
    {
      name: 'Análisis de Ventas — Power BI',
      slug: 'analisis-ventas-power-bi',
      description: 'Dashboard de análisis de ventas y rendimiento desarrollado en Mirgor (Samsung). Tablas dinámicas, BUSCARV, KPIs de productividad y reportes automatizados.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/powerbi1/600/450'],
      brand: 'Power BI · Excel · SQL',
      featured: true,
      categoryId: dataAnalysis.id,
    },
    {
      name: 'Portfolio Personal',
      slug: 'portfolio-personal',
      description: 'Este mismo portfolio. Desarrollado con React + Vite + TypeScript + TailwindCSS. Backend Node.js + Express + Prisma. Deploy en Railway y Vercel.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/portfolio1/600/450'],
      brand: 'React · TypeScript · Node.js · Prisma',
      featured: false,
      categoryId: webApps.id,
    },
    {
      name: 'Automatización de Reportes',
      slug: 'automatizacion-reportes-excel',
      description: 'Scripts de automatización para generación de reportes operativos en TMT. Reducción del tiempo de reporting de 4 horas a 20 minutos mediante fórmulas avanzadas y macros.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/automatizacion1/600/450'],
      brand: 'Excel · Python · Google Sheets',
      featured: false,
      categoryId: automatizacion.id,
    },
    {
      name: 'API REST con Django',
      slug: 'api-rest-django',
      description: 'API REST desarrollada con Django y Django REST Framework como proyecto final del curso en Educación IT. CRUD completo, autenticación y despliegue en PythonAnywhere.',
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: ['https://picsum.photos/seed/django1/600/450'],
      brand: 'Django · Python · REST API',
      featured: false,
      categoryId: backend.id,
    },
  ]

  let created = 0
  for (const proyecto of proyectos) {
    await prisma.product.upsert({
      where: { slug: proyecto.slug },
      update: {},
      create: proyecto,
    })
    created++
  }

  console.log(`[seed] ✓ ${created} proyectos creados`)

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'alexisplescia@gmail.com' },
    update: {},
    create: {
      email: 'alexisplescia@gmail.com',
      password: hashedPassword,
      name: 'Alexis Plescia',
      role: 'ADMIN',
    },
  })
  console.log('[seed] ✓ Admin: alexisplescia@gmail.com / admin123')

  // Store config
  const configs = [
    { key: 'store_name', value: 'Alexis Plescia — Portfolio' },
    { key: 'store_description', value: 'Desarrollador Full Stack & Analista de Datos' },
    { key: 'store_phone', value: '+549 1127242060' },
    { key: 'store_email', value: 'alexisplescia@gmail.com' },
    { key: 'store_address', value: 'Hurlingham, Buenos Aires, Argentina' },
    { key: 'free_shipping_threshold', value: '0' },
    { key: 'shipping_cost', value: '0' },
    { key: 'currency', value: 'ARS' },
    { key: 'instagram_url', value: '' },
    { key: 'whatsapp_number', value: '5491127242060' },
    { key: 'announcement_bar', value: '' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/in/alexisplescia/' },
    { key: 'github_url', value: 'https://github.com/AlexisPlescia' },
  ]
  for (const cfg of configs) {
    await prisma.storeConfig.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value },
      create: cfg,
    })
  }
  console.log('[seed] ✓ Store config cargada')

  // Supress unused variable warnings
  void mobile
  void devops
  void iaDatos
  void otros

  console.log('[seed] ✓ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('[seed] Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
