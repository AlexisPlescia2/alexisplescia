// Casos de estudio del portfolio.
// Contenido estático: se sirve desde Vercel junto con el frontend, así que
// carga al instante y no depende de que el backend de Render esté despierto.
// Capturas y archivos de ejemplo viven en /public/casos/<slug>/.
// En los textos, **así** se muestra en negrita.

export type CategoriaCaso =
  | 'Desarrollo Web'
  | 'Análisis Funcional'
  | 'Dashboards & KPIs'
  | 'Automatización'
  | 'Análisis de Datos'

export interface Captura {
  src: string
  epigrafe: string
}

export interface Archivo {
  nombre: string
  href: string
  descripcion: string
}

export interface Caso {
  slug: string
  orden: number
  titulo: string
  categoria: CategoriaCaso
  destacado: boolean
  stack: string[]
  resumen: string
  /** Contexto laboral del caso, se muestra arriba del detalle */
  contexto?: string
  /** true = el caso usa datos de trabajo reemplazados por ficticios */
  datosFicticios: boolean
  problemaTitulo?: string
  problema: string
  queHiceTitulo?: string
  queHice: string[]
  como: string[]
  resultado: string[]
  aprendizaje: string
  capturas: Captura[]
  archivos: Archivo[]
  links?: { label: string; href: string }[]
}

export const AVISO_DATOS_FICTICIOS =
  'Todos los datos mostrados son ficticios, con el fin de respetar la privacidad de la empresa.'

export const CATEGORIAS_CASOS: { nombre: CategoriaCaso; icono: string }[] = [
  { nombre: 'Desarrollo Web', icono: '🌐' },
  { nombre: 'Análisis Funcional', icono: '🗂️' },
  { nombre: 'Dashboards & KPIs', icono: '📈' },
  { nombre: 'Automatización', icono: '🔄' },
  { nombre: 'Análisis de Datos', icono: '📊' },
]

const img = (slug: string, file: string) => `/casos/${slug}/${file}.webp`
const dl = (slug: string, file: string) => `/casos/${slug}/descargas/${file}`

const CARREFOUR = 'Data Analyst · Mantenimiento y Eficiencia Energética · Carrefour Argentina'

export const CASOS: Caso[] = [
  {
    slug: 'prometeo-tattoo',
    orden: 1,
    titulo: 'Prometeo Tattoo: e-commerce full stack',
    categoria: 'Desarrollo Web',
    destacado: false,
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'MercadoPago'],
    resumen:
      'Tienda online de insumos para tatuadores con catálogo, carrito, pago con MercadoPago y panel de administración, en producción.',
    contexto: 'Proyecto propio en producción',
    datosFicticios: false,
    problemaTitulo: 'Objetivo',
    problema:
      'Construir una tienda online completa para insumos de tatuaje: que el cliente pueda encontrar productos, armar su carrito y pagar, y que la tienda pueda administrar catálogo, categorías y pedidos sin tocar código.',
    queHice: [
      '**Catálogo** con filtros por categoría, marca y precio.',
      '**Carrito persistente** y checkout completo.',
      '**Pagos con MercadoPago**: preferencia de pago, redirección y confirmación por webhook.',
      '**Panel de administración** para productos, categorías y pedidos.',
      '**Autenticación JWT** con roles de cliente y administrador.',
    ],
    como: [
      'Frontend en React 18 + TypeScript con Vite, Zustand y Tailwind, desplegado en Vercel.',
      'API en Node 20 + Express + TypeScript, con validación de cada endpoint con Zod, Helmet, CORS y rate limiting, desplegada en Render.',
      'Base PostgreSQL en Supabase con Prisma, e imágenes de productos en Supabase Storage.',
      'La orden y el stock se actualizan dentro de una sola transacción: si algo falla, no queda una venta a medias.',
      'Contraseñas con bcrypt, tests de auth y órdenes con Vitest, y Docker para desarrollo local.',
    ],
    resultado: [
      'Tienda funcionando en producción, de punta a punta: catálogo, carrito, pago y administración.',
      'Arquitectura y modelo de datos documentados a partir del código fuente.',
    ],
    aprendizaje:
      'Operar un proyecto en producción enseña cosas que el desarrollo no: con el pooler de Supabase en modo Transaction las prepared statements de Prisma fallan y hay que usar modo Session, un keep-alive que no consulta la base no evita que Supabase la pause, y en una SPA hay que declarar el routing en Vercel o los links directos dan 404.',
    capturas: [
      { src: img('prometeo-tattoo', 'prometeo_01_home'), epigrafe: 'Home de la tienda.' },
      { src: img('prometeo-tattoo', 'prometeo_02_categorias'), epigrafe: 'Catálogo por categorías con la cantidad de productos de cada una.' },
      { src: img('prometeo-tattoo', 'prometeo_03_arquitectura'), epigrafe: 'Arquitectura (frontend, API, datos y servicios) y flujo de compra con MercadoPago.' },
      { src: img('prometeo-tattoo', 'prometeo_04_modelo_datos'), epigrafe: 'Modelo de datos en Prisma y checklist de seguridad y calidad.' },
      { src: img('prometeo-tattoo', 'prometeo_05_movil'), epigrafe: 'Versión móvil.' },
    ],
    archivos: [],
    links: [{ label: 'Ver la tienda', href: 'https://prometeo-claude.vercel.app/' }],
  },
  {
    slug: 'control-de-accesos',
    orden: 2,
    titulo: 'App de control de accesos para tienda',
    categoria: 'Desarrollo Web',
    destacado: true,
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Render'],
    resumen:
      'App para registrar ingresos y egresos de portería, movimientos de grupos electrógenos y relevamientos de frío alimentario, con historial y tableros de análisis.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'La portería de la tienda registraba en papel y en planillas sueltas quién entraba, a qué sector iba y cuánto tiempo se quedaba. No quedaba historial confiable, no se sabía qué proveedores ingresaban más o menos, y los movimientos de grupos electrógenos (salidas a service, regresos, traslados) no tenían trazabilidad.',
    queHice: [
      '**Registro de portería:** ingreso y egreso por perfil (proveedor, repartos, técnico, visita, otro), con autocompletado de empresas y personas frecuentes.',
      '**Grupos electrógenos:** salidas a service, ingresos, traslados entre tiendas y pruebas de carga, con horómetro, combustible, remito y estado al ingreso. Cada equipo tiene su historial completo.',
      '**Dashboard:** ingresos por semana y por hora, empresas que más y menos ingresan, permanencia media y personas en tienda en este momento.',
      '**Relevamiento de frío alimentario:** carga de muebles y temperaturas por tienda, con alertas cuando la temperatura medida se aleja de la objetivo.',
      '**Auditoría:** quién cargó o modificó cada registro y cuándo.',
    ],
    como: [
      'Frontend en React, armado como un solo archivo autocontenido porque la red corporativa bloquea los CDN externos.',
      'Backend Node.js + Express desplegado en Render, con keep-alive programado para evitar el arranque en frío del plan gratuito.',
      'Base PostgreSQL con tablas de registros, configuración, usuarios y auditoría.',
    ],
    resultado: [
      'Historial completo y consultable de cada ingreso y de cada movimiento de grupo electrógeno.',
      'Datos para negociar y planificar con proveedores: quién ingresa más, en qué horarios y cuánto tiempo se queda.',
      'La misma app sumó el relevamiento de frío alimentario, en lugar de tener otra planilla más.',
    ],
    aprendizaje:
      'Las restricciones de la red corporativa definen la arquitectura antes que cualquier preferencia técnica. Y una app que ya está en uso es el mejor lugar para sumar el próximo relevamiento.',
    capturas: [
      { src: img('control-de-accesos', 'accesos_02_dashboard'), epigrafe: 'Dashboard: ingresos por semana, por perfil, por hora y empresas que más ingresan.' },
      { src: img('control-de-accesos', 'accesos_01_registro'), epigrafe: 'Registro de portería: formulario de ingreso por perfil y movimientos del día.' },
      { src: img('control-de-accesos', 'accesos_03_grupos_electrogenos'), epigrafe: 'Grupos electrógenos: estado de cada equipo e historial de movimientos.' },
      { src: img('control-de-accesos', 'accesos_04_frio_alimentario'), epigrafe: 'Relevamiento de frío alimentario: muebles, temperaturas y estado por tienda.' },
      { src: img('control-de-accesos', 'accesos_05_arquitectura'), epigrafe: 'Arquitectura pensada para funcionar detrás del proxy corporativo, modelo de datos y roadmap de seguridad.' },
      { src: img('control-de-accesos', 'accesos_02_dashboard_oscuro'), epigrafe: 'El mismo dashboard en modo oscuro.' },
    ],
    archivos: [
      {
        nombre: 'control_de_accesos_ficticio.xlsx',
        href: dl('control-de-accesos', 'control_de_accesos_ficticio.xlsx'),
        descripcion: 'Registros (≈1.650 ingresos), grupos electrógenos, relevamiento de frío y resumen de proveedores.',
      },
    ],
  },
  {
    slug: 'analisis-funcional-cmms',
    orden: 3,
    titulo: 'Análisis funcional de un CMMS para implementar módulos nuevos',
    categoria: 'Análisis Funcional',
    destacado: true,
    stack: ['Relevamiento', 'Máquina de estados', 'MoSCoW', 'Matriz impacto-esfuerzo', 'Heurísticas de UX'],
    resumen:
      'Relevé el sistema de gestión de mantenimiento de punta a punta, detecté estados trampa y brechas de datos, y armé un roadmap priorizado para implementar módulos nuevos.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'El sistema de gestión de mantenimiento (CMMS) que usa toda la red de tiendas tenía órdenes de trabajo que quedaban abiertas meses, indicadores que no se podían calcular y datos clave (materiales usados, gas refrigerante cargado, horas de grupos electrógenos) que nunca se registraban. Antes de sumar módulos nuevos había que entender qué estaba roto y por qué.',
    queHice: [
      'Mapeé los módulos, los **6 roles** que usan el sistema y el flujo completo de urgencias.',
      'Modelé la **máquina de estados** de la orden de trabajo y encontré los **estados trampa**: "En curso" sin fecha límite, "Espera de repuesto" que no existe en el sistema y "Reabierta" sin motivo.',
      'Listé **12 requerimientos** con prioridad MoSCoW y los ubiqué en una **matriz impacto × esfuerzo**.',
      'Revisé qué **KPIs** se pueden medir hoy y qué dato falta para cada uno.',
      'Armé un **roadmap en 4 fases**: primero cambios de formulario sin desarrollo y después integración y versión móvil.',
      'Presenté el relevamiento a los responsables del área y lo ajusté con su feedback.',
    ],
    como: [
      'Entrevistas con usuarios de cada rol, pruebas del flujo dentro del sistema, evaluación heurística de usabilidad y documentación en planilla y presentación HTML.',
    ],
    resultado: [
      'Un diagnóstico compartido: qué falla, a quién afecta y cuánto cuesta arreglarlo.',
      'Las "ganancias rápidas" identificadas (registrar materiales y gas por OT, separar el correctivo detectado en preventivo) desbloquean indicadores sin desarrollo.',
      'El relevamiento es la base para la migración a un nuevo sistema de mantenimiento.',
    ],
    aprendizaje:
      'Un indicador que "no se puede medir" casi siempre es un problema de proceso, no de reporte. Arreglar el estado de la OT vale más que el mejor tablero.',
    capturas: [
      { src: img('analisis-funcional-cmms', 'cmms_01_relevamiento'), epigrafe: 'Matriz impacto × esfuerzo, máquina de estados con los estados trampa en naranja y KPIs medibles hoy.' },
    ],
    archivos: [
      {
        nombre: 'relevamiento_funcional_ficticio.xlsx',
        href: dl('analisis-funcional-cmms', 'relevamiento_funcional_ficticio.xlsx'),
        descripcion: 'Requerimientos, máquina de estados, roles, KPIs y roadmap.',
      },
    ],
  },
  {
    slug: 'dashboard-mantenimiento',
    orden: 4,
    titulo: 'Dashboard de mantenimiento: proactividad y costo',
    categoria: 'Dashboards & KPIs',
    destacado: false,
    stack: ['Looker Studio', 'Google Sheets', 'Excel'],
    resumen:
      'Tablero que separa el mantenimiento preventivo del correctivo para medir qué tan proactiva es cada tienda y dónde se va el costo.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'El volumen de órdenes de trabajo no decía nada por sí solo: una tienda con muchas OTs podía estar haciendo bien el preventivo o estar apagando incendios. Hacía falta un indicador que distinguiera el origen de cada OT.',
    queHice: [
      'Definí un modelo de **3 categorías**: preventivo, correctivo detectado durante un preventivo (esperable) y correctivo puro (reactivo y caro).',
      'Creé el **índice de proactividad** por tienda: preventivos ÷ (preventivos + correctivos puros).',
      'Armé el tablero con evolución mensual por categoría, costo por especialidad y ranking de tiendas contra una meta.',
    ],
    como: [
      'Tablero en Looker Studio con campos calculados para el índice de proactividad y el costo por categoría, sobre las órdenes de trabajo exportadas del sistema de mantenimiento.',
    ],
    resultado: [
      'Se ve de un vistazo qué tiendas son reactivas y conviene revisar su plan preventivo.',
      'En los datos de ejemplo, el correctivo puro es menos de un tercio de las OTs pero se lleva más de la mitad del costo.',
    ],
    aprendizaje:
      'El volumen de llamados engaña sin su origen. La categoría correcta vale más que cualquier gráfico.',
    capturas: [
      { src: img('dashboard-mantenimiento', 'mantenimiento_01_dashboard'), epigrafe: 'KPIs, OTs por mes y categoría, costo por especialidad e índice de proactividad por tienda contra la meta del 75 %.' },
    ],
    archivos: [
      {
        nombre: 'ordenes_de_trabajo_ficticias.xlsx',
        href: dl('dashboard-mantenimiento', 'ordenes_de_trabajo_ficticias.xlsx'),
        descripcion: '2.400 OTs de 16 tiendas en 12 meses, más el índice por tienda.',
      },
    ],
  },
  {
    slug: 'automatizacion-compresores',
    orden: 5,
    titulo: 'Automatización de la base de compresores',
    categoria: 'Automatización',
    destacado: true,
    stack: ['Google Apps Script', 'Google Sheets', 'Looker Studio', 'Exports de ERP'],
    resumen:
      'Uní 3 exports del ERP con formatos distintos en una base limpia que se actualiza sola todos los días y alimenta un tablero.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'La información de compresores de refrigeración venía de 3 fuentes del ERP, una por tipo de equipo: herméticos (consumo de stock), semiherméticos (reparación externa) y autocontenidos (compra). Cada export tenía otro formato de fecha, de importe y de código de tienda, y el orden de las columnas cambiaba entre descargas. Consolidarlas a mano llevaba horas y generaba errores.',
    queHice: [
      'Diseñé una **base unificada** de 7 columnas estándar: tipo, ruta, tienda, fecha, cantidad, importe y origen.',
      'Escribí un script en **Apps Script** que lee cada fuente **por nombre de columna, nunca por posición**, normaliza fechas, importes y tiendas, y reescribe la base completa.',
      'Le sumé un **disparador diario** y un menú propio para correrlo a mano.',
      'Generé los resúmenes por tienda y tipo con fórmulas automáticas y conecté todo a un tablero de Looker Studio.',
    ],
    como: [
      'Google Sheets + Apps Script. Si un export cambia y falta una columna, el script falla con un mensaje claro en vez de cargar datos corridos.',
    ],
    resultado: [
      'Una sola fuente de verdad para el tablero, actualizada cada mañana sin intervención.',
      'Cero errores por columnas movidas.',
      'Permitió calcular reparaciones por compresor instalado y priorizar tiendas para recambio.',
    ],
    aprendizaje:
      'Nunca asumir la posición de las columnas en un export. Y en una base de datos operativa, agregar es más seguro que sacar.',
    capturas: [
      { src: img('automatizacion-compresores', 'automatizacion_01_pipeline'), epigrafe: 'Flujo de 3 fuentes → script → base unificada → resúmenes y tablero, con el antes y el después de los datos.' },
    ],
    archivos: [
      {
        nombre: 'automatizacion_compresores_ejemplo.gs',
        href: dl('automatizacion-compresores', 'automatizacion_compresores_ejemplo.gs'),
        descripcion: 'Script de Apps Script (versión de ejemplo).',
      },
      {
        nombre: 'fuentes_crudas_ficticias.xlsx',
        href: dl('automatizacion-compresores', 'fuentes_crudas_ficticias.xlsx'),
        descripcion: 'Las 3 fuentes con sus formatos originales.',
      },
      {
        nombre: 'base_unificada_ficticia.xlsx',
        href: dl('automatizacion-compresores', 'base_unificada_ficticia.xlsx'),
        descripcion: 'El resultado del script.',
      },
    ],
  },
  {
    slug: 'auditoria-relevamiento',
    orden: 6,
    titulo: 'Auditoría y limpieza de un relevamiento con 3 versiones',
    categoria: 'Análisis de Datos',
    destacado: true,
    stack: ['Python', 'pandas', 'openpyxl', 'Excel'],
    resumen:
      'Limpié y comparé 3 versiones de un relevamiento de frío alimentario cargado por distintos editores y detecté cambios anómalos, como un mueble que pasó de 4 a 30 unidades en una sola edición.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'Un relevamiento de muebles de frío alimentario (pozos, islas, murales y cámaras por tienda) existía en 3 versiones editadas por personas distintas. Cada una escribía las tiendas a su manera, mezclaba números con texto, usaba formatos de fecha diferentes y dejaba duplicados. Nadie sabía cuál era la versión correcta ni qué había cambiado.',
    queHice: [
      '**Normalicé** cada versión: "Tda 46", "T-0046" y " TIENDA 46 " pasan a "Tienda 46"; "12 u." pasa a 12; tres formatos de fecha quedan en uno.',
      '**Eliminé** duplicados y filas de tiendas que no existen en el maestro.',
      '**Comparé** las 3 versiones tienda por tienda y mueble por mueble.',
      '**Marqué** como anómalo todo cambio que multiplica o divide la cantidad por 3 o más. No los corrijo solo: quedan marcados para validar en tienda.',
      'Dejé un **log** de cada regla aplicada y cuántas filas afectó.',
    ],
    como: [
      'Python con pandas. El script se corre de nuevo con cada versión nueva y genera la base limpia con su reporte en Excel.',
    ],
    resultado: [
      'Base limpia de 96 combinaciones tienda/mueble, sobre 100 filas leídas en la última versión.',
      '12 combinaciones con cambios entre versiones, de las cuales **3 son anómalas**: un pozo que pasó de 4 a 30, una isla con un cero de más y un mural que quedó en 0.',
      'Un proceso repetible en lugar de una revisión a ojo.',
    ],
    aprendizaje:
      'Limpiar no es corregir: los datos raros se marcan y se validan con quien conoce la tienda. Ese caso de 4 a 30 lo encontró el script, no una revisión manual.',
    capturas: [
      { src: img('auditoria-relevamiento', 'limpieza_01_auditoria'), epigrafe: 'Qué se normalizó, reglas aplicadas y cambios anómalos entre versiones.' },
    ],
    archivos: [
      {
        nombre: 'limpieza_relevamiento.py',
        href: dl('auditoria-relevamiento', 'limpieza_relevamiento.py'),
        descripcion: 'Script de limpieza y comparación.',
      },
      {
        nombre: 'relevamiento_frio_v1_ficticio.xlsx',
        href: dl('auditoria-relevamiento', 'relevamiento_frio_v1_ficticio.xlsx'),
        descripcion: 'Versión 1 "sucia".',
      },
      {
        nombre: 'relevamiento_frio_v2_ficticio.xlsx',
        href: dl('auditoria-relevamiento', 'relevamiento_frio_v2_ficticio.xlsx'),
        descripcion: 'Versión 2 "sucia".',
      },
      {
        nombre: 'relevamiento_frio_v3_ficticio.xlsx',
        href: dl('auditoria-relevamiento', 'relevamiento_frio_v3_ficticio.xlsx'),
        descripcion: 'Versión 3 "sucia".',
      },
      {
        nombre: 'maestro_tiendas_ficticio.xlsx',
        href: dl('auditoria-relevamiento', 'maestro_tiendas_ficticio.xlsx'),
        descripcion: 'Maestro contra el que se valida.',
      },
      {
        nombre: 'base_limpia_y_reporte.xlsx',
        href: dl('auditoria-relevamiento', 'base_limpia_y_reporte.xlsx'),
        descripcion: 'Resultado: base limpia, comparación, anómalos y log.',
      },
    ],
  },
  {
    slug: 'eficiencia-energetica',
    orden: 7,
    titulo: 'Eficiencia energética: energía reactiva y plan de ahorro',
    categoria: 'Dashboards & KPIs',
    destacado: false,
    stack: ['Python', 'pandas', 'Google Sheets', 'Looker Studio'],
    resumen:
      'Cómo trabajo la eficiencia energética: limpio la facturación, sigo la energía reactiva y sus multas, y convierto el análisis en un plan de acción para las tiendas de peor desempeño.',
    contexto: CARREFOUR,
    datosFicticios: true,
    problema:
      'La distribuidora multa cuando el factor de potencia (cos φ) cae por debajo de 0,95. Las multas por energía reactiva se pagaban todos los meses, pero el reporte de facturación llegaba con filas de totales, sedes que no son tiendas y tiendas con doble medidor, así que no se sabía dónde se concentraba el problema.',
    queHiceTitulo: 'Cómo me manejo',
    queHice: [
      '**Datos:** limpio el export de facturación. Saco totales y sede central, unifico medidores dobles y valido contra el total del reporte.',
      '**Diagnóstico:** sigo consumo, cos φ y multas por tienda, región y formato, y cruzo con el estado de los bancos de capacitores.',
      '**Priorización:** identifico las **tiendas Flop**, las de peor desempeño, que concentran la mayor parte del problema.',
      '**Acción:** cada tienda Flop tiene causa raíz, acción, responsable y estado. El tablero muestra si la acción funcionó.',
    ],
    como: [
      'Limpieza de la facturación con Python y pandas, seguimiento en Google Sheets y tableros en Looker Studio.',
    ],
    resultado: [
      'En los datos de ejemplo, el 97 % de las multas se concentra en 4 tiendas.',
      'Al reparar sus bancos de capacitores, el cos φ supera 0,95 y la multa desaparece.',
      'El análisis pasa de "pagamos multas" a "estas 4 tiendas, por esta causa, con este responsable".',
    ],
    aprendizaje:
      'En eficiencia energética el dato más valioso no es el consumo total sino la concentración: pocas tiendas explican casi todo el problema.',
    capturas: [
      { src: img('eficiencia-energetica', 'energia_02_reactiva'), epigrafe: 'Energía reactiva: cos φ por tienda y mes, tiendas con más multa y causa raíz.' },
      { src: img('eficiencia-energetica', 'energia_03_plan_de_ahorro'), epigrafe: 'Plan de ahorro: línea base contra consumo real, ahorro mensual y medidas con su inversión y repago.' },
    ],
    archivos: [
      {
        nombre: 'energia_ficticia.xlsx',
        href: dl('eficiencia-energetica', 'energia_ficticia.xlsx'),
        descripcion: 'Consumo mensual (16 tiendas × 12 meses), export crudo de facturación y plan de tiendas Flop.',
      },
    ],
  },
  {
    slug: 'ventas-retail',
    orden: 8,
    titulo: 'Ventas retail: resultado por local, rotación y ROI',
    categoria: 'Análisis de Datos',
    destacado: false,
    stack: ['Power BI', 'Excel', 'SQL'],
    resumen:
      'Análisis de ventas de una cadena de electrónica: resultado operativo por local, rotación de productos y ROI de acciones comerciales.',
    contexto:
      'Basado en el tipo de análisis que hacía como Retail Shift Supervisor en Grupo Mirgor: el puesto era de supervisión y el análisis era parte de mis tareas.',
    datosFicticios: true,
    problema:
      'Los locales se comparaban solo por venta. Un local que vende mucho puede perder plata si su alquiler y su personal son caros, y las acciones comerciales (promociones, capacitaciones, combos, horarios) se evaluaban por intuición.',
    queHice: [
      'Crucé ventas por local con los **costos fijos** de cada local (alquiler, personal y servicios) para obtener el **resultado operativo**.',
      'Analicé la **rotación** de productos con una curva ABC y detecté el stock inmovilizado.',
      'Medí el **ROI de cada acción comercial**: (margen incremental − inversión) ÷ inversión.',
      'Comparé vendedores por conversión, ticket promedio y venta de accesorios.',
    ],
    como: ['Tableros en Power BI sobre ventas y costos consolidados en Excel y consultas SQL.'],
    resultado: [
      'El local de aeropuerto tiene la mejor venta por m², pero el alquiler se come el margen y su resultado es negativo. El outlet tiene mucho m² que no vende: candidato a achicar superficie.',
      '14 de 40 SKUs explican el 80 % de la venta, y hay stock inmovilizado candidato a liquidar o dejar de reponer.',
      'De 4 acciones comerciales, 2 tienen ROI positivo (capacitación en venta consultiva y combo celular + accesorio) y 2 negativo (promo de cuotas sin interés y extensión de horario).',
    ],
    aprendizaje:
      'Vender más no es ganar más. El resultado por local y el ROI por acción cambian las decisiones que el ranking de ventas no muestra.',
    capturas: [
      { src: img('ventas-retail', 'retail_01_dashboard'), epigrafe: 'Resumen comercial: venta mensual, ticket promedio e indicadores por local.' },
      { src: img('ventas-retail', 'retail_04_locales_y_costos'), epigrafe: 'Costo locativo sobre venta, del margen bruto al resultado y ROI de acciones comerciales.' },
      { src: img('ventas-retail', 'retail_03_rotacion'), epigrafe: 'Rotación: curva ABC, rotación por categoría y stock inmovilizado.' },
      { src: img('ventas-retail', 'retail_02_vendedores'), epigrafe: 'Vendedores: conversión contra ticket promedio y venta de accesorios.' },
    ],
    archivos: [
      {
        nombre: 'retail_mirgor_ficticio.xlsx',
        href: dl('ventas-retail', 'retail_mirgor_ficticio.xlsx'),
        descripcion: 'Ventas, costos por local, resultado y ROI de acciones (datos ficticios).',
      },
    ],
  },
]

export const casosOrdenados = [...CASOS].sort((a, b) => a.orden - b.orden)
export const casosDestacados = casosOrdenados.filter((c) => c.destacado)
export const getCaso = (slug: string) => CASOS.find((c) => c.slug === slug)

/** Slug de URL para una categoría: "Dashboards & KPIs" → "dashboards-kpis" */
export const categoriaSlug = (c: string) =>
  c
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const contarPorCategoria = (c: CategoriaCaso) => CASOS.filter((x) => x.categoria === c).length
