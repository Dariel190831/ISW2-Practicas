function calcularMora(monto, diasVencidos) {
  if (typeof monto !== 'number' || monto < 0) {
    throw new Error('El monto no puede ser negativo');
  }
  if (typeof diasVencidos !== 'number' || Number.isNaN(diasVencidos)) {
    throw new Error('Los días vencidos deben ser un número');
  }

  if (diasVencidos > 0) {
    return monto * 0.05;
  }
  return 0;
}

function aplicarAbono(monto, abono) {
  if (typeof abono !== 'number' || abono < 0) {
    throw new Error('El abono no puede ser negativo');
  }
  const saldoRestante = monto - abono;
  return saldoRestante > 0 ? saldoRestante : 0;
}

function calcularMoraConAbono(monto, abono, diasVencidos) {
  const saldoRestante = aplicarAbono(monto, abono);
  return calcularMora(saldoRestante, diasVencidos);
}

module.exports = { calcularMora, aplicarAbono, calcularMoraConAbono };
