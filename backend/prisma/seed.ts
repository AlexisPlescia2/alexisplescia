import 'dotenv/config'
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
            projectUrl: 'https://prometeo-claude.vercel.app/shop?page=1',
            githubUrl: 'https://github.com/alexisplescia',
            brand: 'React · Node.js · PostgreSQL · MercadoPago',
            featured: true,
            categoryId: webApps.id,
    },
    {
            name: 'Análisis Funcional y Desarrollo de Software',
            slug: 'analisis-funcional-desarrollo-software',
            description: 'Relevamiento funcional completo de un sistema CMMS (gestión de mantenimiento) usado a nivel nacional, combinado con desarrollo de software: APIs REST, formación full stack y metodologías ágiles.',
            features: [
                      'Mapeo completo de módulos y relevamiento de roles/actores del sistema',
                      'Diseño de máquina de estados con detección de "estados trampa" y flujo end-to-end de urgencias',
                      'Identificación de KPIs posibles vs. bloqueados y gaps priorizados por impacto',
                      'Desarrollo de API REST con Django y Django REST Framework (CRUD, autenticación, documentación Swagger)',
                      'Formación en metodologías ágiles (SCRUM, historias INVEST) y stack full stack (React, Flask, SQL/NoSQL, Docker, Git)',
                    ],
            price: 0,
            comparePrice: null,
            onSale: false,
            stock: 1,
            images: [
                      'https://picsum.photos/seed/analisisfuncional1/800/500',
                      'https://picsum.photos/seed/analisisfuncional2/800/500',
                      'https://picsum.photos/seed/analisisfuncional3/800/500',
                    ],
            githubUrl: 'https://github.com/alexisplescia',
            brand: 'Análisis Funcional · Django · SCRUM · Jira',
            featured: true,
            categoryId: backend.id,
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
            githubUrl: 'https://github.com/alexisplescia',
            brand: 'Looker Studio · Google Sheets · Excel',
            featured: true,
            categoryId: dashboards.id,
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
            githubUrl: 'https://github.com/alexisplescia',
            brand: 'Power BI · Excel · SQL',
            featured: true,
            categoryId: dataAnalysis.id,
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
            githubUrl: 'https://github.com/alexisplescia',
            brand: 'Excel · Python · Google Sheets',
            featured: false,
            categoryId: automatizacion.id,
    },
      ]

  let created = 0
    for (const proyecto of proyectos) {
          await prisma.product.upsert({
                  where: { slug: proyecto.slug },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  update: { features: proyecto.features, images: proyecto.images, description: proyecto.description, projectUrl: (proyecto as any).projectUrl ?? null, githubUrl: (proyecto as any).githubUrl ?? null },
                  create: proyecto,
          })
          created++
    }

  // Borra proyectos que ya no forman parte del portfolio (fueron sacados de la lista de arriba)
  const { count: deletedCount } = await prisma.product.deleteMany({
        where: { slug: { notIn: proyectos.map((p) => p.slug) } },
  })
    if (deletedCount > 0) {
          console.log(`[seed] ✓ ${deletedCount} proyecto(s) obsoleto(s) eliminado(s)`)
    }

  console.log(`[seed] ✓ ${created} proyectos creados`)

  // Admin users — passwords loaded from env vars (never hardcoded)
  const adminUsers = [
    {
            email: process.env.SEED_ADMIN_EMAIL ?? 'alexisplescia@gmail.com',
            password: process.env.SEED_ADMIN_PASSWORD,
            name: 'Alexis Plescia',
    },
    {
            email: process.env.SEED_ADMIN2_EMAIL ?? 'zakhi@alexisplescia.com',
            password: process.env.SEED_ADMIN2_PASSWORD,
            name: 'Zakhi',
    },
      ]

  for (const admin of adminUsers) {
        if (!admin.password) {
                console.warn(`[seed] ⚠ Saltando ${admin.email} — variable de entorno no definida`)
                continue
        }
        const hashed = await bcrypt.hash(admin.password, 12)
        await prisma.user.upsert({
                where: { email: admin.email },
                update: { password: hashed, role: 'ADMIN', name: admin.name },
                create: { email: admin.email, password: hashed, name: admin.name, role: 'ADMIN' },
        })
        console.log(`[seed] ✓ Admin creado/actualizado: ${admin.email}`)
  }

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
  void ecommerce
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
