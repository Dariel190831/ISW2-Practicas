function calcularMora(monto, diasVencidos) {
  if (diasVencidos > 0) {
    return monto * 0.05;
  }
  return 0;
}

module.exports = { calcularMora };
