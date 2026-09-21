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

test('calcula 5% de mora cuando hay días vencidos', () => {
  const monto = 1000;
  const dias = 5;
  const resultado = calcularMora(monto, dias);
  assertEqual(resultado, 50);
});

test('devuelve 0 cuando no hay días vencidos', () => {
  const monto = 1000;
  const dias = 0;
  const resultado = calcularMora(monto, dias);
  assertEqual(resultado, 0);
});

test('monto 0 da mora 0 aunque esté vencido', () => {
  const monto = 0;
  const dias = 10;
  const resultado = calcularMora(monto, dias);
  assertEqual(resultado, 0);
});

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

test('días no numéricos lanza error', () => {
  const monto = 1000;
  const dias = 'cinco';
  let lanzoError = false;
  try {
    calcularMora(monto, dias);
  } catch (err) {
    lanzoError = true;
  }
  assertEqual(lanzoError, true);
});

test('días negativos no cuenta como vencido (borde)', () => {
  const monto = 1000;
  const dias = -3;
  const resultado = calcularMora(monto, dias);
  assertEqual(resultado, 0);
});
