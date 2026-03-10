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
      description: 'E-commerce full stack para tienda de insumos de tatuajes con carrito, checkout y panel de administración.',
      features: [
        'Catálogo de productos con filtros por categoría, marca y precio',
        'Carrito de compras persistente y proceso de checkout completo',
        'Integración con MercadoPago para pagos online',
        'Panel de administración para gestionar productos, categorías y pedidos',
        'Autenticación JWT con roles de usuario y administrador',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/prometeo1/800/500',
        'https://picsum.photos/seed/prometeo2/800/500',
        'https://picsum.photos/seed/prometeo3/800/500',
      ],
      projectUrl: 'https://prometeo-claude.vercel.app',
      brand: 'React · Node.js · PostgreSQL · MercadoPago',
      featured: true,
      categoryId: webApps.id,
    },
    {
      name: 'Armería Sniper — E-commerce',
      slug: 'armeria-sniper-ecommerce',
      description: 'Fork y rebranding de e-commerce para armería deportiva. Mismo stack, nuevo rubro, deploy en VPS con Nginx + PM2.',
      features: [
        'Adaptación completa de branding y categorías para armería deportiva',
        'Deploy en VPS Hostinger con Nginx como reverse proxy y PM2 como gestor de procesos',
        'Gestión de inventario y stock en tiempo real',
        'Catálogo con filtros avanzados y búsqueda por producto',
        'Sistema de pedidos y notificaciones por email',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/sniper1/800/500',
        'https://picsum.photos/seed/sniper2/800/500',
        'https://picsum.photos/seed/sniper3/800/500',
      ],
      brand: 'React · Node.js · Nginx · PM2',
      featured: true,
      categoryId: ecommerce.id,
    },
    {
      name: 'Dashboard KPIs — Carrefour',
      slug: 'dashboard-looker-carrefour',
      description: 'Dashboards interactivos en Looker Studio para monitoreo de KPIs energéticos en más de 500 locales a nivel nacional.',
      features: [
        'Monitoreo de consumo eléctrico y eficiencia energética por local',
        'Visualización de KPIs operativos con comparativas históricas',
        'Reportes automáticos semanales y mensuales para gerencia',
        'Alertas de anomalías en consumo con umbrales configurables',
        'Integración con Google Sheets y fuentes de datos externas',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/carrefour1/800/500',
        'https://picsum.photos/seed/carrefour2/800/500',
        'https://picsum.photos/seed/carrefour3/800/500',
      ],
      brand: 'Looker Studio · Google Sheets · Excel',
      featured: true,
      categoryId: dashboards.id,
    },
    {
      name: 'App de Gestión de Tareas',
      slug: 'task-manager-flask-react',
      description: 'Aplicación web de gestión de tareas con backend Flask y frontend React. Autenticación JWT, CRUD completo y Docker.',
      features: [
        'Creación, edición y eliminación de tareas con estados (pendiente, en progreso, completado)',
        'Autenticación segura con JWT y refresh tokens',
        'API REST documentada con endpoints para usuarios y tareas',
        'Containerización con Docker y docker-compose para desarrollo y producción',
        'Filtros y búsqueda de tareas por estado, fecha y prioridad',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/taskapp1/800/500',
        'https://picsum.photos/seed/taskapp2/800/500',
        'https://picsum.photos/seed/taskapp3/800/500',
      ],
      brand: 'Flask · React · Docker · PostgreSQL',
      featured: false,
      categoryId: webApps.id,
    },
    {
      name: 'Análisis de Ventas — Power BI',
      slug: 'analisis-ventas-power-bi',
      description: 'Dashboard de análisis de ventas y rendimiento en Mirgor (Samsung) con KPIs de productividad y reportes automatizados.',
      features: [
        'Dashboard interactivo de ventas con drill-down por zona, vendedor y producto',
        'KPIs de productividad con semáforos de alerta (verde/amarillo/rojo)',
        'Tablas dinámicas y BUSCARV para cruce de datos entre áreas',
        'Reportes automáticos exportables en PDF y Excel',
        'Comparativas de rendimiento mensual vs objetivos planificados',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/powerbi1/800/500',
        'https://picsum.photos/seed/powerbi2/800/500',
        'https://picsum.photos/seed/powerbi3/800/500',
      ],
      projectUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZjE2ZDY4ZDUtMTMyNS00OTJjLTkxZmItYmE0N2VjZjY5Nzc5IiwidCI6IjAyYjI3MGFhLWZiMmUtNDUzYS05Mjk0LTIyZWE3YjZiNGRmNiJ9',
      brand: 'Power BI · Excel · SQL',
      featured: true,
      categoryId: dataAnalysis.id,
    },
    {
      name: 'Portfolio Personal',
      slug: 'portfolio-personal',
      description: 'Este mismo portfolio. React + Vite + TypeScript + TailwindCSS en Vercel, backend Node.js + Prisma en Railway.',
      features: [
        'Showcase de proyectos con carousel de imágenes y layout split',
        'Panel de administración para gestionar proyectos y configuración',
        'Sección de contacto con formulario y notificaciones',
        'Diseño dark mode con sistema de componentes propio',
        'Deploy automático desde GitHub a Vercel y Railway',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/portfolio1/800/500',
        'https://picsum.photos/seed/portfolio2/800/500',
        'https://picsum.photos/seed/portfolio3/800/500',
      ],
      projectUrl: 'https://plesciaportfolio.infinityfreeapp.com/',
      brand: 'React · TypeScript · Node.js · Prisma',
      featured: false,
      categoryId: webApps.id,
    },
    {
      name: 'Automatización de Reportes',
      slug: 'automatizacion-reportes-excel',
      description: 'Scripts de automatización para reportes operativos en TMT. Reducción de 4 horas a 20 minutos en el proceso de reporting.',
      features: [
        'Automatización de consolidación de datos de múltiples fuentes en un solo reporte',
        'Reducción del tiempo de generación de reportes de 4 horas a 20 minutos',
        'Scripts Python para limpieza y transformación de datos masivos',
        'Dashboards automáticos en Google Sheets con actualización programada',
        'Fórmulas avanzadas y macros VBA para reportes Excel dinámicos',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/automatiz1/800/500',
        'https://picsum.photos/seed/automatiz2/800/500',
        'https://picsum.photos/seed/automatiz3/800/500',
      ],
      brand: 'Excel · Python · Google Sheets',
      featured: false,
      categoryId: automatizacion.id,
    },
    {
      name: 'API REST con Django',
      slug: 'api-rest-django',
      description: 'API REST con Django y Django REST Framework como proyecto final de Educación IT. CRUD, autenticación y deploy en PythonAnywhere.',
      features: [
        'CRUD completo de recursos con serializers y viewsets de DRF',
        'Autenticación por token con registro y login de usuarios',
        'Documentación automática de endpoints con Swagger/OpenAPI',
        'Deploy en PythonAnywhere con configuración de WSGI',
        'Tests unitarios para endpoints críticos con cobertura +80%',
      ],
      price: 0,
      comparePrice: null,
      onSale: false,
      stock: 1,
      images: [
        'https://picsum.photos/seed/django1/800/500',
        'https://picsum.photos/seed/django2/800/500',
        'https://picsum.photos/seed/django3/800/500',
      ],
      brand: 'Django · Python · REST API',
      featured: false,
      categoryId: backend.id,
    },
  ]

  let created = 0
  for (const proyecto of proyectos) {
    await prisma.product.upsert({
      where: { slug: proyecto.slug },
      update: { features: proyecto.features, images: proyecto.images, description: proyecto.description },
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

  const hashedZakhi = await bcrypt.hash('1984', 10)
  await prisma.user.upsert({
    where: { email: 'zakhi@alexisplescia.com' },
    update: {},
    create: {
      email: 'zakhi@alexisplescia.com',
      password: hashedZakhi,
      name: 'Zakhi',
      role: 'ADMIN',
    },
  })
  console.log('[seed] ✓ Admin: zakhi@alexisplescia.com / 1984')

  const hashedAdmin = await bcrypt.hash('198484', 10)
  await prisma.user.upsert({
    where: { email: 'admin@alexisplescia123.com' },
    update: {},
    create: {
      email: 'admin@alexisplescia123.com',
      password: hashedAdmin,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('[seed] ✓ Admin: admin@alexisplescia123.com / 198484')

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
    { key: 'github_url', value: 'https://github.com/AlexisPlescia' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/in/alexisplescia/' },
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
