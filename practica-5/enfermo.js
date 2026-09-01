// practica-5/enfermo.js
// Sistema de pedidos de "Pulpería La Esquina".
// ADVERTENCIA: código con problemas sembrados a propósito para la Práctica 5.
// NO refactorizar este archivo directamente: es la foto del "antes".
// El refactor paso a paso se hace sobre practica-5/sano.js.

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
  for (let i = 0; i < items.length; i++) {
    let p = items[i];
    if (!inventario[p.nombre]) {
      console.log("Producto no existe: " + p.nombre);
      continue;
    }
    if (inventario[p.nombre].stock < p.cantidad) {
      console.log("Sin stock suficiente para " + p.nombre);
      continue;
    }
    let subtotal = inventario[p.nombre].precio * p.cantidad;
    total = total + subtotal;
    detalle = detalle + p.nombre + " x" + p.cantidad + " = " + subtotal + "\n";
    inventario[p.nombre].stock = inventario[p.nombre].stock - p.cantidad;
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
