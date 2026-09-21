const { calcularMora, aplicarAbono, calcularMoraConAbono } = require('./fiados');

function test(nombre, fn) {
  try {
    fn();
    console.log(`✅ ${nombre}`);
  } catch (err) {
    console.log(`❌ ${nombre} — ${err.message}`);
  }
}

function assertEqual(actual, esperado) {
  if (actual !== esperado) {
    throw new Error(`esperaba ${esperado}, obtuve ${actual}`);
  }
}

// --- Práctica 9: abonos parciales que reducen el saldo antes de calcular mora ---

test('aplicarAbono reduce el monto por el abono', () => {
  assertEqual(aplicarAbono(1000, 300), 700);
});

test('un abono mayor al monto deja el saldo en 0, nunca negativo', () => {
  assertEqual(aplicarAbono(500, 800), 0);
});

test('un abono negativo lanza error', () => {
  let lanzoError = false;
  try {
    aplicarAbono(500, -100);
  } catch (err) {
    lanzoError = true;
  }
  assertEqual(lanzoError, true);
});

test('calcularMoraConAbono calcula la mora sobre el saldo YA reducido, no el original', () => {
  // monto 1000, abono 400 -> saldo 600
  // calcularMora usa 5% plano -> mora esperada = 600 * 0.05 = 30 (no 50)
  assertEqual(calcularMoraConAbono(1000, 400, 5), 30);
});

test('sin abono (0), calcularMoraConAbono da igual resultado que calcularMora original', () => {
  const original = calcularMora(1000, 5);
  assertEqual(calcularMoraConAbono(1000, 0, 5), original);
});
