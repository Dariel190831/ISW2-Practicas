# Arquitectura — April Collections (C4)

> Este diagrama fue corregido a partir de un primer borrador generado con
> IA, que tenía tecnologías inventadas (React, Node.js + Express,
> PostgreSQL, Vercel/Render) y una integración de pasarela de pagos que no
> existe. Los cambios reales están listados en "Correcciones" al final.

## Nivel 1 — Diagrama de contexto

```mermaid
flowchart TB
    admin(["👤 Administradora del negocio<br/>Registra ventas, controla<br/>cobros e inventario"])
    cliente(["👤 Cliente<br/>Consulta su deuda pendiente"])

    app["🖥️ April Collections<br/>Sistema de gestión de ventas,<br/>cobros e inventario del negocio"]

    admin -->|"Registra ventas,<br/>revisa deudores y stock"| app
    cliente -->|"Consulta su saldo<br/>y deudas pendientes"| app

    classDef persona fill:#08427b,color:#fff,stroke:#052e56
    classDef sistema fill:#1168bd,color:#fff,stroke:#0b4884
    class admin,cliente persona
    class app sistema
```

### Decisión 1 — Portal de consulta para el cliente, sin pasarela de pagos

Los clientes pueden ver su deuda pendiente dentro del sistema, pero el
pago en sí se sigue registrando manualmente por la administradora, sin
una pasarela de pagos en línea integrada. Prioricé **transparencia y
experiencia del cliente** (poder consultar cuánto debe sin tener que
llamar) por sobre la complejidad y el riesgo de seguridad de integrar
cobros con tarjeta (cumplimiento de estándares de pago, manejo de datos
sensibles). Es un punto intermedio: el cliente ve, pero no paga en línea
todavía.

## Nivel 2 — Diagrama de contenedores

```mermaid
flowchart TB
    admin(["👤 Administradora del negocio"])
    cliente(["👤 Cliente"])

    subgraph appsys["April Collections"]
        app["🖥️ Aplicación web<br/>Tecnología: Django (Python)<br/>Sirve la interfaz y la lógica<br/>en un solo servicio<br/>Hosting: Railway"]
        db[("🗄️ Base de datos<br/>Tecnología: MySQL")]
    end

    admin -->|"HTTPS"| app
    cliente -->|"HTTPS"| app
    app -->|"Lee y escribe<br/>ventas, cobros, inventario"| db

    classDef persona fill:#08427b,color:#fff,stroke:#052e56
    classDef contenedor fill:#438dd5,color:#fff,stroke:#2e6295
    classDef basedatos fill:#438dd5,color:#fff,stroke:#2e6295
    class admin,cliente persona
    class app contenedor
    class db basedatos
```

### Decisión 2 — Un solo contenedor (monolito) en vez de frontend y backend separados

Django sirve tanto la interfaz como la lógica de negocio en un único
servicio desplegado en Railway, en vez de separar un frontend y un
backend como servicios independientes. Prioricé **simplicidad de
despliegue y mantenimiento** — un solo servicio para actualizar y
monitorear, sin manejo de CORS ni versiones de API que sincronizar entre
dos partes — por sobre la escalabilidad independiente que ofrecería
separarlos. Dado el volumen bajo de tráfico de un negocio familiar, la
complejidad operativa extra de dos servicios no se justifica frente al
beneficio.

## Correcciones que hice al borrador de la IA

- Eliminé la pasarela de pagos: el sistema no procesa pagos en línea, el
  cliente solo consulta su deuda.
- Eliminé el nodo de WhatsApp/SMS: no se envían recordatorios automáticos.
- Agregué al Cliente como actor de nivel 1: sí existe un portal para que
  consulte su deuda pendiente, algo que no estaba en el borrador original.
- Cambié la tecnología del backend: en vez de Node.js + Express, es
  Django (Python), desplegado en Railway.
- Cambié la base de datos: en vez de PostgreSQL, es MySQL.
- Cambié la arquitectura de contenedores: no hay un frontend separado (ni
  React ni Vue.js) — Django sirve todo en un solo servicio (monolito), no
  en contenedores independientes de frontend y backend como proponía el
  borrador.
