/**
 * Automatización de la base de compresores (versión de portfolio, datos ficticios).
 *
 * Une 3 fuentes con formatos distintos en una sola hoja "Base unificada":
 *   - Fuente A: consumos de stock (herméticos)      → fecha "dd.mm.aaaa", importe "1.234,56"
 *   - Fuente B: órdenes + pedidos (semiherméticos)  → tienda dentro de la ubicación técnica
 *   - Fuente C: solicitudes + movimientos (autocont.) → fecha "d/m/aaaa", solo movimientos de entrada
 *
 * Reglas de diseño:
 *   1. Las columnas se buscan por NOMBRE de encabezado, nunca por posición (los exports cambian el orden).
 *   2. Agregar, no sacar: la base nueva se reescribe completa, las fuentes no se tocan.
 *   3. Se ejecuta sola todos los días (disparador) y también desde un menú.
 */

const HOJA_DESTINO = 'Base unificada';
const ENCABEZADOS_DESTINO = ['Tipo', 'Ruta', 'Tienda', 'Fecha', 'Cantidad', 'Importe ($)', 'Origen'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Compresores')
    .addItem('Actualizar base unificada', 'actualizarBase')
    .addItem('Crear disparador diario', 'crearDisparadorDiario')
    .addToUi();
}

function actualizarBase() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const filas = []
    .concat(leerHermeticos(libro))
    .concat(leerSemihermeticos(libro))
    .concat(leerAutocontenidos(libro))
    .sort((a, b) => a[3] - b[3]);

  const destino = libro.getSheetByName(HOJA_DESTINO) || libro.insertSheet(HOJA_DESTINO);
  destino.clearContents();
  destino.getRange(1, 1, 1, ENCABEZADOS_DESTINO.length).setValues([ENCABEZADOS_DESTINO]).setFontWeight('bold');
  if (filas.length) {
    destino.getRange(2, 1, filas.length, ENCABEZADOS_DESTINO.length).setValues(filas);
    destino.getRange(2, 4, filas.length, 1).setNumberFormat('dd/mm/yyyy');
    destino.getRange(2, 6, filas.length, 1).setNumberFormat('#.##0,00');
  }
  destino.setFrozenRows(1);
  libro.toast(`Base actualizada: ${filas.length} filas`, 'Compresores', 5);
}

// ── Fuentes ─────────────────────────────────────────────

function leerHermeticos(libro) {
  const { datos, col } = leerHoja(libro, 'Fuente A - hermeticos', ['Centro', 'Fecha contab.', 'Cantidad', 'Importe ML']);
  return datos.map(f => [
    'Hermético', 'Stock interno',
    'Tienda ' + String(f[col['Centro']]).replace(/\D/g, ''),
    fechaDesde(f[col['Fecha contab.']], /(\d+)\.(\d+)\.(\d+)/),
    Number(f[col['Cantidad']]),
    importeDesde(f[col['Importe ML']]),
    'Fuente A (consumos de stock)'
  ]);
}

function leerSemihermeticos(libro) {
  const { datos, col } = leerHoja(libro, 'Fuente B - semihermeticos', ['Ubicación técnica', 'Fecha', 'Valor neto']);
  return datos.map(f => [
    'Semihermético', 'Reparación externa',
    'Tienda ' + String(f[col['Ubicación técnica']]).split('-')[1].replace(/\D/g, ''),  // AR-T123-FRIO-CEN1 → 123
    new Date(f[col['Fecha']]),
    1,
    Number(f[col['Valor neto']]),
    'Fuente B (órdenes + pedidos)'
  ]);
}

function leerAutocontenidos(libro) {
  const { datos, col } = leerHoja(libro, 'Fuente C - autocontenidos', ['Centro', 'Fe.solicitud', 'Cantidad solicitada', 'Movimiento MB51']);
  return datos
    .filter(f => String(f[col['Movimiento MB51']]) === '101')  // solo entradas de mercadería
    .map(f => [
      'Autocontenido', 'Compra',
      'Tienda ' + f[col['Centro']],
      fechaDesde(f[col['Fe.solicitud']], /(\d+)\/(\d+)\/(\d+)/),
      Number(f[col['Cantidad solicitada']]),
      '',
      'Fuente C (solicitudes + movimientos)'
    ]);
}

// ── Utilidades ──────────────────────────────────────────

/** Devuelve las filas y un mapa nombre de columna → índice. Falla claro si falta una columna. */
function leerHoja(libro, nombre, requeridas) {
  const hoja = libro.getSheetByName(nombre);
  if (!hoja) throw new Error(`No existe la hoja "${nombre}"`);
  const [encabezados, ...datos] = hoja.getDataRange().getValues();
  const col = {};
  encabezados.forEach((e, i) => col[String(e).trim()] = i);
  const faltantes = requeridas.filter(r => !(r in col));
  if (faltantes.length) throw new Error(`En "${nombre}" faltan columnas: ${faltantes.join(', ')}`);
  return { datos: datos.filter(f => f.join('') !== ''), col };
}

/** Convierte texto de fecha día-mes-año con el patrón dado. Si ya es Date, la devuelve. */
function fechaDesde(valor, patron) {
  if (valor instanceof Date) return valor;
  const m = String(valor).match(patron);
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])) : '';
}

/** "1.234,56" → 1234.56 */
function importeDesde(valor) {
  if (typeof valor === 'number') return valor;
  return Number(String(valor).replace(/\./g, '').replace(',', '.')) || 0;
}

function crearDisparadorDiario() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'actualizarBase')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('actualizarBase').timeBased().everyDays(1).atHour(7).create();
  SpreadsheetApp.getActiveSpreadsheet().toast('Disparador diario creado (7 h)', 'Compresores', 5);
}
