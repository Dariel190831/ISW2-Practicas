// practica-5/sano.js
// Sistema de pedidos de "Pulpería La Esquina" — versión refactorizada.
// Punto de partida: copia exacta de enfermo.js. A partir de acá se aplican
// los pasos de refactor descritos en el historial de commits y en
// practica-5/diagnostico.md.

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
    if (total > 500) {
      total = total - total * 0.15;
    } else {
      total = total - total * 0.05;
    }
  } else if (tipoCliente === "frecuente") {
    if (total > 500) {
      total = total - total * 0.1;
    } else {
      total = total - total * 0.03;
    }
  }

  total = total + total * 0.15;

  historialVentas.push({ cliente: cliente, total: total, fecha: new Date() });

  console.log("=== RECIBO ===");
  console.log(detalle);
  console.log("TOTAL: " + total.toFixed(2));
  console.log("Cliente: " + cliente);

  return total;
}

module.exports = { procesarPedido, inventario, historialVentas };
