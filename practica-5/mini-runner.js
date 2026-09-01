// practica-5/mini-runner.js
// Mini test runner sin dependencias externas (estilo P4): registra pruebas,
// las ejecuta todas y reporta un resumen. Termina con código de salida 1
// si algo falla, para poder usarse en CI.

const pruebas = [];

function test(nombre, fn) {
  pruebas.push({ nombre, fn });
}

function assertEqual(actual, esperado, mensaje = "") {
  if (actual !== esperado) {
    throw new Error(
      `${mensaje}\n    Esperado: ${JSON.stringify(esperado)}\n    Actual:   ${JSON.stringify(actual)}`
    );
  }
}

function assertCercano(actual, esperado, tolerancia = 0.01, mensaje = "") {
  if (Math.abs(actual - esperado) > tolerancia) {
    throw new Error(`${mensaje}\n    Esperado ~${esperado}, actual ${actual}`);
  }
}

function assertVerdadero(valor, mensaje = "") {
  if (!valor) throw new Error(mensaje || "Se esperaba un valor verdadero");
}

function ejecutar() {
  let pasaron = 0;
  let fallaron = 0;

  for (const { nombre, fn } of pruebas) {
    try {
      fn();
      console.log(`  OK    ${nombre}`);
      pasaron++;
    } catch (err) {
      console.log(`  FAIL  ${nombre}`);
      console.log(`        ${err.message}`);
      fallaron++;
    }
  }

  console.log(`\n${pasaron} pasaron, ${fallaron} fallaron de ${pruebas.length} pruebas.`);
  if (fallaron > 0) process.exitCode = 1;
}

module.exports = { test, assertEqual, assertCercano, assertVerdadero, ejecutar };
