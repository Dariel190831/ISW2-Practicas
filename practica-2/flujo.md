# GitFlow vs Trunk-Based Development

GitFlow es un modelo con varias ramas de larga duración: main, develop,
feature/*, release/* y hotfix/*. Cada funcionalidad nace de develop y solo
llega a main pasando por una rama de release. Da mucho control sobre qué se
libera y cuándo, pero agrega complejidad porque hay que mantener varias
ramas sincronizadas al mismo tiempo.

Trunk-based development se basa en una sola rama principal (main), donde
todos integran cambios pequeños y frecuentes usando ramas de vida muy
corta. Esto exige buena integración continua y pruebas automáticas, porque
cualquier error llega rápido a main.

Para una app web como April Collections o PropTrack, usaría trunk-based
development: al desplegar seguido, tener una sola rama estable reduce
conflictos de merge y permite detectar errores más rápido. GitFlow tendría
más sentido en software con releases planificados y espaciados.

## Resumen comparativo

| Aspecto | GitFlow | Trunk-Based |
|---|---|---|
| Ramas de larga duración | Sí (main, develop, release, hotfix) | No, solo main |
| Frecuencia de integración | Baja/media | Alta (varias veces al día) |
| Complejidad de manejo de ramas | Alta | Baja |
| Requiere CI/CD robusto | Recomendable | Prácticamente obligatorio |
| Ideal para | Releases planificados y versionados | Despliegue continuo |

En mi caso, para proyectos como April Collections o PropTrack —donde el
objetivo es iterar rápido y desplegar seguido a producción (Vercel/Render)—
trunk-based development encaja mejor con el flujo de trabajo real de un
equipo pequeño.
