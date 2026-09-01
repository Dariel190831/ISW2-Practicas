// practica-5/sano.js
// Sistema de pedidos de "Pulpería La Esquina" — versión refactorizada.
// Punto de partida: copia exacta de enfermo.js. A partir de acá se aplican
// los pasos de refactor descritos en el historial de commits y en
// practica-5/diagnostico.md.

const TASA_IMPUESTO = 0.15;
const UMBRAL_DESCUENTO_ALTO = 500;
const DESCUENTO_MAYORISTA_ALTO = 0.15;
const DESCUENTO_MAYORISTA_BAJO = 0.05;
const DESCUENTO_FRECUENTE_ALTO = 0.1;
const DESCUENTO_FRECUENTE_BAJO = 0.03;

let inventario = {
  arroz: { precio: 25, stock: 100 },
  frijoles: { precio: 30, stock: 80 },
  aceite: { precio: 45, stock: 50 },
  jabon: { precio: 15, stock: 200 },
};

let historialVentas = [];

function procesarPedido(items, cliente, tipoCliente) {
  let total = 0;
  let detalle = "";
  for (const item of items) {
    if (!inventario[item.nombre]) {
      console.log("Producto no existe: " + item.nombre);
      continue;
    }
    if (inventario[item.nombre].stock < item.cantidad) {
      console.log("Sin stock suficiente para " + item.nombre);
      continue;
    }
    let subtotal = inventario[item.nombre].precio * item.cantidad;
    total = total + subtotal;
    detalle = detalle + item.nombre + " x" + item.cantidad + " = " + subtotal + "\n";
    inventario[item.nombre].stock = inventario[item.nombre].stock - item.cantidad;
  }

  if (tipoCliente === "mayorista") {
    if (total > UMBRAL_DESCUENTO_ALTO) {
      total = total - total * DESCUENTO_MAYORISTA_ALTO;
    } else {
      total = total - total * DESCUENTO_MAYORISTA_BAJO;
    }
  } else if (tipoCliente === "frecuente") {
    if (total > UMBRAL_DESCUENTO_ALTO) {
      total = total - total * DESCUENTO_FRECUENTE_ALTO;
    } else {
      total = total - total * DESCUENTO_FRECUENTE_BAJO;
    }
  }

  total = total + total * TASA_IMPUESTO;

  historialVentas.push({ cliente: cliente, total: total, fecha: new Date() });

  console.log("=== RECIBO ===");
  console.log(detalle);
  console.log("TOTAL: " + total.toFixed(2));
  console.log("Cliente: " + cliente);

  return total;
}

module.exports = { procesarPedido, inventario, historialVentas };
