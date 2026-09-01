// practica-5/sano.test.js
// Los MISMOS casos y valores esperados que enfermo.test.js, pero apuntando
// a sano.js. Este archivo no cambia a lo largo de los commits de refactor
// (renombrar, extraer constante, early return, separar responsabilidad,
// invertir dependencia): si algo se rompe, alguno de estos tests lo marca
// en rojo antes de llegar a la siguiente etapa.

const { test, assertEqual, assertCercano, ejecutar } = require("./mini-runner");
const { procesarPedido, inventario, historialVentas } = require("./sano");

function resetInventario() {
  inventario.arroz.stock = 100;
  inventario.frijoles.stock = 80;
  inventario.aceite.stock = 50;
  inventario.jabon.stock = 200;
  historialVentas.length = 0;
}

test("calcula el total de un pedido simple con impuesto incluido", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "arroz", cantidad: 2 }], "Juan", "normal");
  assertCercano(total, 57.5, 0.01, "total con impuesto");
});

test("aplica descuento de 5% a mayorista con compra baja (<=500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "aceite", cantidad: 5 }], "Distribuidora X", "mayorista");
  assertCercano(total, 245.8125, 0.01, "descuento mayorista bajo");
});

test("aplica descuento de 15% a mayorista con compra alta (>500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "aceite", cantidad: 12 }], "Distribuidora X", "mayorista");
  assertCercano(total, 527.85, 0.01, "descuento mayorista alto");
});

test("aplica descuento de 3% a cliente frecuente con compra baja (<=500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "jabon", cantidad: 10 }], "Ana", "frecuente");
  assertCercano(total, 167.325, 0.01, "descuento frecuente bajo");
});

test("descuenta el stock del inventario tras la venta", () => {
  resetInventario();
  procesarPedido([{ nombre: "jabon", cantidad: 10 }], "María", "normal");
  assertEqual(inventario.jabon.stock, 190, "stock actualizado");
});

test("ignora productos que no existen en el inventario (no suman al total)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "inexistente", cantidad: 1 }], "Pedro", "normal");
  assertEqual(total, 0, "no suma productos inexistentes");
});

test("ignora ítems sin stock suficiente y no toca el stock", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "aceite", cantidad: 999 }], "Pedro", "normal");
  assertEqual(total, 0, "no cobra ítems sin stock");
  assertEqual(inventario.aceite.stock, 50, "el stock no cambia");
});

test("registra la venta en el historial con el cliente correcto", () => {
  resetInventario();
  procesarPedido([{ nombre: "arroz", cantidad: 1 }], "Ana", "normal");
  assertEqual(historialVentas.length, 1, "una venta registrada");
  assertEqual(historialVentas[0].cliente, "Ana", "cliente correcto en historial");
});

ejecutar();
