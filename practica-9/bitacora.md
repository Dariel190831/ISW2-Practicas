# Bitácora — Práctica 9: Sesión agéntica documentada

## Feature elegida
Abonos parciales que reducen el saldo antes de calcular mora
(`aplicarAbono`, `calcularMoraConAbono` sobre `calcularMora` de la Práctica 4)

## Evidencia — tests ANTES de implementar (M4)

### Suite en rojo (captura)
<img width="1072" height="431" alt="image" src="https://github.com/user-attachments/assets/da89f3b3-f566-44f3-a6cf-4106ed71bf11" />


### Commits TDD
* Commit "red": `test(fiados): red — abonos parciales antes de mora`
* Commit "green": `feat(fiados): implementa aplicarAbono y calcularMoraConAbono — green`

### Suite en verde (captura)
<img width="827" height="200" alt="image" src="https://github.com/user-attachments/assets/ff56bf91-6464-45c6-a96b-27bb283ae076" />


## Prompt usado con la IA
> Tengo esta calculadora de fiados (fiados.js) y estos tests que definen el
> comportamiento esperado (practica9.test.js). Implementá las funciones
> aplicarAbono y calcularMoraConAbono para que los tests pasen, sin modificar
> calcularMora.

## Qué propuso la IA
Reutilizó `calcularMora` dentro de `calcularMoraConAbono` en vez de reescribir
la lógica del 5%, evitando duplicar la regla de negocio. Validó el abono
negativo lanzando un error con el mismo estilo (`throw new Error(...)`) que ya
usa `calcularMora`. El excedente de un abono mayor al monto se resuelve con un
ternario que devuelve 0 en vez de un número negativo.

## Críticas fundamentadas

1. **Reutilización sobre duplicación (DRY)** — Acepté que `calcularMoraConAbono`
   llame a `calcularMora` en vez de reescribir el `monto * 0.05`. Si mañana
   cambia la tasa de mora, solo hay que tocarla en un lugar.

2. **Consistencia en el manejo de errores** — La IA usó el mismo patrón de
   `throw new Error('mensaje descriptivo')` que ya existía en `calcularMora`
   para validar el abono negativo, en vez de inventar un estilo nuevo (por
   ejemplo, devolver `null` o `false`). Lo acepté porque mantiene el código
   predecible: quien use el módulo sabe que siempre va a manejar excepciones,
   no un mix de errores y valores especiales.

3. **Responsabilidad única (SRP) — lo que cambié** — En la primera versión,
   `aplicarAbono` mezclaba la validación del abono con el cálculo del saldo
   restante en la misma función. Le pedí una alternativa (ver abajo) que
   separa `validarAbono()` como función propia. Preferí quedarme con la
   versión SIN separar para esta feature puntual, porque `validarAbono` no se
   reutiliza en ningún otro lado todavía — separar una función que solo se usa
   una vez agrega indirección sin beneficio real (YAGNI).

## Alternativa forzada
Prompt: "¿Cómo implementarías aplicarAbono separando la validación en su
propia función, y usando Math.max en vez de un ternario?"

Comparación: la alternativa (`validarAbono()` + `Math.max(0, monto - abono)`)
es más legible si alguien más adelante necesita validar un abono en otro
contexto, pero para el alcance actual agrega una capa extra sin necesidad.
Me quedé con la versión original por simplicidad (YAGNI > separación
prematura), documentando acá el trade-off para que quede explícito por qué.
