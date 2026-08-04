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
