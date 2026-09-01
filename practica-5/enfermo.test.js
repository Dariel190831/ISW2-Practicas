// practica-5/enfermo.test.js
// Red de seguridad ANTES del refactor (principio 6): estos tests describen
// el comportamiento ACTUAL de enfermo.js, con sus reglas de negocio tal
// cual están hoy (incluyendo cosas cuestionables, como que un pedido con
// productos inválidos simplemente devuelva 0 en vez de avisar al llamador).
// El objetivo NO es validar que el código sea "bueno", sino congelar lo que
// hace, para poder refactorizar sin miedo a romperlo.

const { test, assertEqual, assertCercano, ejecutar } = require("./mini-runner");
const { procesarPedido, inventario, historialVentas } = require("./enfermo");

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
  // 2 * 25 = 50 (sin descuento, tipo normal) + 15% impuesto = 57.5
  assertCercano(total, 57.5, 0.01, "total con impuesto");
});

test("aplica descuento de 5% a mayorista con compra baja (<=500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "aceite", cantidad: 5 }], "Distribuidora X", "mayorista");
  // subtotal 225 -> descuento 5% -> 213.75 -> +15% impuesto = 245.8125
  assertCercano(total, 245.8125, 0.01, "descuento mayorista bajo");
});

test("aplica descuento de 15% a mayorista con compra alta (>500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "aceite", cantidad: 12 }], "Distribuidora X", "mayorista");
  // subtotal 540 -> descuento 15% -> 459 -> +15% impuesto = 527.85
  assertCercano(total, 527.85, 0.01, "descuento mayorista alto");
});

test("aplica descuento de 3% a cliente frecuente con compra baja (<=500)", () => {
  resetInventario();
  const total = procesarPedido([{ nombre: "jabon", cantidad: 10 }], "Ana", "frecuente");
  // subtotal 150 -> descuento 3% -> 145.5 -> +15% impuesto = 167.325
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
