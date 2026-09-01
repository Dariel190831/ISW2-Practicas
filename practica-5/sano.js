// practica-5/sano.js
// Sistema de pedidos de "Pulpería La Esquina" — versión refactorizada.
// Punto de partida: copia exacta de enfermo.js. A partir de acá se aplican
// los pasos de refactor descritos en el historial de commits y en
// practica-5/diagnostico.md.

const TASA_IMPUESTO = 0.15;
const UMBRAL_DESCUENTO_ALTO = 500;

// Tabla de descuentos por tipo de cliente: agregar un tipo nuevo (ej. "vip")
// es agregar una fila acá, no tocar la lógica de obtenerPorcentajeDescuento.
const DESCUENTOS_POR_TIPO_CLIENTE = {
  mayorista: { alto: 0.15, bajo: 0.05 },
  frecuente: { alto: 0.1, bajo: 0.03 },
};

// Fábrica del inventario inicial: antes era un objeto global fijo del que
// procesarPedido dependía directamente. Ahora es un valor cualquiera que se
// puede crear, inyectar o mockear (Inversión de Dependencias).
function crearInventarioInicial() {
  return {
    arroz: { precio: 25, stock: 100 },
    frijoles: { precio: 30, stock: 80 },
    aceite: { precio: 45, stock: 50 },
    jabon: { precio: 15, stock: 200 },
  };
}

let inventario = crearInventarioInicial();
let historialVentas = [];

function calcularSubtotalDeItem(item, inventarioActual) {
  const producto = inventarioActual[item.nombre];
  if (!producto) {
    return { ok: false, motivo: "Producto no existe: " + item.nombre };
  }
  if (producto.stock < item.cantidad) {
    return { ok: false, motivo: "Sin stock suficiente para " + item.nombre };
  }
  return { ok: true, subtotal: producto.precio * item.cantidad };
}

function aplicarItemsAlPedido(items, inventarioActual) {
  let total = 0;
  let detalle = "";
  const errores = [];
  for (const item of items) {
    const calculo = calcularSubtotalDeItem(item, inventarioActual);
    if (!calculo.ok) {
      errores.push(calculo.motivo);
      continue;
    }
    total = total + calculo.subtotal;
    detalle = detalle + item.nombre + " x" + item.cantidad + " = " + calculo.subtotal + "\n";
    inventarioActual[item.nombre].stock = inventarioActual[item.nombre].stock - item.cantidad;
  }
  return { total, detalle, errores };
}

function obtenerPorcentajeDescuento(tipoCliente, subtotal) {
  const descuentos = DESCUENTOS_POR_TIPO_CLIENTE[tipoCliente];
  if (!descuentos) return 0;
  return subtotal > UMBRAL_DESCUENTO_ALTO ? descuentos.alto : descuentos.bajo;
}

function calcularTotalConDescuentoEImpuesto(subtotal, tipoCliente) {
  const porcentajeDescuento = obtenerPorcentajeDescuento(tipoCliente, subtotal);
  const totalConDescuento = subtotal - subtotal * porcentajeDescuento;
  return totalConDescuento + totalConDescuento * TASA_IMPUESTO;
}

function formatearRecibo(detalle, total, cliente) {
  return (
    "=== RECIBO ===\n" +
    detalle +
    "\n" +
    "TOTAL: " + total.toFixed(2) + "\n" +
    "Cliente: " + cliente
  );
}

// inventarioActual, historial y logger son inyectables: por defecto usan el
// estado del módulo y console.log (mismo comportamiento que antes), pero
// cualquier llamador puede pasar sus propias dependencias (por ejemplo un
// inventario de prueba o un logger que junte mensajes en un arreglo) sin
// tocar esta función. Así procesarPedido deja de depender de una
// implementación concreta y pasa a depender de una interfaz simple.
function procesarPedido(
  items,
  cliente,
  tipoCliente,
  inventarioActual = inventario,
  historial = historialVentas,
  logger = console.log
) {
  const { total: subtotal, detalle, errores } = aplicarItemsAlPedido(items, inventarioActual);
  errores.forEach((motivo) => logger(motivo));

  const total = calcularTotalConDescuentoEImpuesto(subtotal, tipoCliente);

  historial.push({ cliente: cliente, total: total, fecha: new Date() });

  logger(formatearRecibo(detalle, total, cliente));

  return total;
}

module.exports = {
  procesarPedido,
  aplicarItemsAlPedido,
  calcularSubtotalDeItem,
  obtenerPorcentajeDescuento,
  calcularTotalConDescuentoEImpuesto,
  formatearRecibo,
  crearInventarioInicial,
  inventario,
  historialVentas,
};
