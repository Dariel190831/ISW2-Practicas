# Limpieza de código — Práctica 1

## Código original

Fragmento tomado de `April Collections` (app de gestión para el negocio de mi mamá), función que calcula las estadísticas del mes en la pantalla de inicio:

```javascript
function renderInicio() {
  const mes = parseInt(document.getElementById('filtro-mes')?.value ?? new Date().getMonth());
  const anio = parseInt(document.getElementById('filtro-anio')?.value ?? new Date().getFullYear());
  const hoy = today();
  let ventasMes=0, numVentas=0, ganancia=0, cobradoHoy=0, porCobrar=0;
  let deudores = new Set();
  data.ventas.forEach(v => {
    const d = new Date(v.fecha);
    if(d.getMonth()===mes && d.getFullYear()===anio) {
      ventasMes += v.total; numVentas++;
      const costo = v.items.reduce((s,i)=>s+(i.costo||0)*i.qty,0);
      ganancia += v.total - costo;
    }
    const pend = v.total - (v.abonos||[]).reduce((s,a)=>s+a.monto,0);
    if(pend > 0.01) { porCobrar += pend; deudores.add(v.clienteId); }
    (v.abonos||[]).forEach(a => { if(a.fecha===hoy) cobradoHoy += a.monto; });
  });
  document.getElementById('stat-ventas-mes').textContent = fmt(ventasMes);
  document.getElementById('stat-num-ventas').textContent = numVentas + ' ventas';
  document.getElementById('stat-por-cobrar').textContent = fmt(porCobrar);
  document.getElementById('stat-num-deudores').textContent = deudores.size + ' clientes';
  document.getElementById('stat-ganancia').textContent = fmt(ganancia);
  document.getElementById('stat-margen').textContent = 'margen ' + (ventasMes>0?((ganancia/ventasMes)*100).toFixed(1)+'%':'0%');
  document.getElementById('stat-cobrado-hoy').textContent = fmt(cobradoHoy);
}
```

## Code smells identificados

1. **Long Method (método largo)** — `renderInicio()` hace demasiadas cosas a la vez: lee inputs del DOM, calcula 5 métricas distintas y actualiza 7 elementos del DOM. Debería dividirse en funciones más pequeñas con una sola responsabilidad.

2. **Mixed concerns (lógica de negocio mezclada con UI)** — el cálculo de ventas, ganancia y deudores está entrelazado con las llamadas a `document.getElementById`. Esto hace difícil probar la lógica sin un navegador.

3. **Magic number** — el `0.01` usado para comparar `pend > 0.01` (para evitar errores de redondeo de punto flotante) aparece "pegado" sin explicación ni constante nombrada.

4. **Nombres poco descriptivos / abreviados** — variables como `d`, `v`, `s`, `i`, `a` dificultan la lectura si no se conoce el contexto completo.

5. **Repetición de `document.getElementById`** — se llama 7 veces de forma directa; no hay una capa que centralice el acceso al DOM.

6. **Falta de manejo de errores** — si `data.ventas` no existe o algún elemento del DOM no está presente, la función falla silenciosamente o lanza una excepción sin control.

## Versión refactorizada

```javascript
const UMBRAL_REDONDEO = 0.01;

function calcularEstadisticasMes(ventas, mes, anio, fechaHoy) {
  const stats = {
    ventasMes: 0,
    numVentas: 0,
    ganancia: 0,
    cobradoHoy: 0,
    porCobrar: 0,
    deudores: new Set(),
  };

  ventas.forEach((venta) => {
    const fechaVenta = new Date(venta.fecha);
    const esDelMes = fechaVenta.getMonth() === mes && fechaVenta.getFullYear() === anio;

    if (esDelMes) {
      const costoTotal = venta.items.reduce((suma, item) => suma + (item.costo || 0) * item.qty, 0);
      stats.ventasMes += venta.total;
      stats.numVentas += 1;
      stats.ganancia += venta.total - costoTotal;
    }

    const abonos = venta.abonos || [];
    const totalAbonado = abonos.reduce((suma, abono) => suma + abono.monto, 0);
    const pendiente = venta.total - totalAbonado;

    if (pendiente > UMBRAL_REDONDEO) {
      stats.porCobrar += pendiente;
      stats.deudores.add(venta.clienteId);
    }

    abonos.forEach((abono) => {
      if (abono.fecha === fechaHoy) stats.cobradoHoy += abono.monto;
    });
  });

  return stats;
}

function pintarEstadisticasEnDOM(stats) {
  const margen = stats.ventasMes > 0
    ? ((stats.ganancia / stats.ventasMes) * 100).toFixed(1) + '%'
    : '0%';

  document.getElementById('stat-ventas-mes').textContent = fmt(stats.ventasMes);
  document.getElementById('stat-num-ventas').textContent = stats.numVentas + ' ventas';
  document.getElementById('stat-por-cobrar').textContent = fmt(stats.porCobrar);
  document.getElementById('stat-num-deudores').textContent = stats.deudores.size + ' clientes';
  document.getElementById('stat-ganancia').textContent = fmt(stats.ganancia);
  document.getElementById('stat-margen').textContent = 'margen ' + margen;
  document.getElementById('stat-cobrado-hoy').textContent = fmt(stats.cobradoHoy);
}

function renderInicio() {
  const mes = parseInt(document.getElementById('filtro-mes')?.value ?? new Date().getMonth());
  const anio = parseInt(document.getElementById('filtro-anio')?.value ?? new Date().getFullYear());
  const hoy = today();

  const stats = calcularEstadisticasMes(data.ventas, mes, anio, hoy);
  pintarEstadisticasEnDOM(stats);
}
```

## Qué cambió y por qué

Separé la función original en dos: `calcularEstadisticasMes` (lógica pura, sin tocar el DOM, fácil de probar) y `pintarEstadisticasEnDOM` (solo se encarga de mostrar los resultados). `renderInicio` ahora solo orquesta ambas. También nombré la constante `UMBRAL_REDONDEO` en vez del número mágico `0.01`, y usé nombres completos en vez de abreviaciones de una letra, para que el código se explique solo al leerlo
