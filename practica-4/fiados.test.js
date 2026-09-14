const { calcularMora } = require('./fiados');

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

test('monto negativo lanza error', () => {
  const monto = -500;
  const dias = 5;
  let lanzoError = false;
  try {
    calcularMora(monto, dias);
  } catch (err) {
    lanzoError = true;
  }
  assertEqual(lanzoError, true);
});
