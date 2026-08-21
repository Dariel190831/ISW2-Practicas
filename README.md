# 🏥 Sistema de Citas Médicas

Una aplicación web completa para gestionar citas médicas, pacientes y médicos de forma eficiente.

## ✨ Características Principales

### Para Pacientes
- ✅ Registro y login seguro
- ✅ Agendar nuevas citas médicas
- ✅ Ver lista de citas próximas y pasadas
- ✅ Cancelar citas si es necesario
- ✅ Acceso al historial médico completo
- ✅ Ver notas y recomendaciones de los médicos

### Para Médicos
- ✅ Gestión completa de citas
- ✅ Confirmación de citas pendientes
- ✅ Marcar citas como completadas
- ✅ Añadir notas médicas a las citas
- ✅ Ver lista de pacientes
- ✅ Historial de consultas

### Características Generales
- 📱 Diseño responsive (funciona en móvil y desktop)
- 🔐 Sistema de autenticación seguro
- 💾 Almacenamiento local (sin necesidad de servidor)
- 🎨 Interfaz moderna y amigable
- 📊 Dashboard con estadísticas
- 🔔 Notificaciones en tiempo real

## 📋 Requisitos

- Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (no es obligatoria una vez cargada la página)

## 🚀 Cómo Usar

### 1. **Abrir la Aplicación**
Simplemente abre el archivo `index.html` en tu navegador web.

### 2. **Crear una Cuenta**

**Opción 1: Como Paciente**
- Haz clic en "Registrarse"
- Selecciona "Paciente"
- Completa los datos (nombre, email, contraseña, teléfono)
- Haz clic en "Registrarse"

**Opción 2: Como Médico**
- Haz clic en "Registrarse"
- Selecciona "Médico"
- Completa los datos incluyendo especialidad y licencia
- Haz clic en "Registrarse"

### 3. **Iniciar Sesión**
- Ingresa tu email y contraseña
- Selecciona tu rol (Paciente o Médico)
- Haz clic en "Iniciar Sesión"

## 💻 Secciones de la Aplicación

### Dashboard
- Vista general de citas próximas y completadas
- Accesos rápidos a funciones principales
- Estadísticas del usuario (para médicos)

### Gestión de Citas
- **Ver Citas**: Muestra todas tus citas
- **Filtros**: Ver todas, próximas o pasadas
- **Nueva Cita**: Agendar una nueva cita con un médico

#### Acciones por Rol:
- **Pacientes**: Pueden cancelar citas
- **Médicos**: Pueden confirmar, rechazar o completar citas
- **Médicos**: Pueden añadir notas a las citas

### Gestión de Pacientes (Solo Médicos)
- Ver lista de todos los pacientes
- Buscar pacientes por nombre, email o teléfono
- Ver historial médico de cada paciente

### Gestión de Médicos (Solo Médicos)
- Ver lista de médicos disponibles
- Agregar nuevos médicos
- Eliminar médicos de la base de datos

### Historial Médico
- Ver todas las citas completadas
- Revisar notas médicas previas
- Acceso completo al historial de consultas

## 🔐 Cuentas de Prueba

La aplicación viene con algunos médicos precargados para que puedas probar:

| Rol | Nombre | Especialidad |
|-----|--------|--------------|
| Médico | Dr. Juan García | Cardiología |
| Médico | Dra. María López | Pediatría |
| Médico | Dr. Carlos Rodríguez | Dermatología |
| Médico | Dra. Ana Martínez | Oftalmología |
| Médico | Dr. Luis Fernández | Traumatología |

### Para Probar:
1. Crea una cuenta como paciente
2. Abreix una nueva pestaña y abre el archivo `index.html` nuevamente
3. Crea una cuenta como médico (o usa uno de los precargados)
4. Cambia entre las dos sesiones para simular el flujo completo

## 📂 Estructura de Archivos

```
App de Citas Medicas/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos CSS
├── app.js              # Lógica de la aplicación
└── README.md           # Este archivo
```

## 💾 Almacenamiento de Datos

La aplicación utiliza **LocalStorage** del navegador para guardar:
- Usuarios registrados
- Citas médicas
- Información de médicos
- Sesión actual del usuario

**Nota**: Los datos se guardan localmente en tu navegador y se pierden si limpias el caché.

## 🎨 Interfaz de Usuario

### Componentes Principales
- **Navbar**: Navegación principal y cierre de sesión
- **Modal de Login**: Autenticación de usuarios
- **Tarjetas de Citas**: Visualización de citas en grid
- **Tablas**: Listado de pacientes y médicos
- **Formularios**: Para crear citas y agregar médicos
- **Notificaciones Toast**: Mensajes de confirmación

## 🔧 Funcionalidades Técnicas

### JavaScript
- Manejo de eventos
- LocalStorage API
- Manipulación del DOM
- Funciones de filtrado y búsqueda
- Validación de formularios

### CSS
- Grid y Flexbox para layouts responsivos
- Variables CSS para colores y estilos
- Animaciones y transiciones
- Media queries para responsividad

## 🌐 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📝 Notas Importantes

1. **Datos Locales**: Los datos se guardan en el navegador, no en un servidor
2. **Multiples Dispositivos**: Los datos no se sincronizan entre dispositivos
3. **Limpieza de Datos**: Si limpias el caché del navegador, perderás todos los datos
4. **Contraseñas**: Las contraseñas se guardan en texto plano (solo para pruebas)

## 🚀 Mejoras Futuras

- [ ] Backend con base de datos real (PostgreSQL/MySQL)
- [ ] Sistema de autenticación más seguro (hashing de contraseñas)
- [ ] Notificaciones por email
- [ ] Llamadas de video para consultas remotas
- [ ] Sistema de pagos
- [ ] Sincronización entre dispositivos
- [ ] Reportes y estadísticas avanzadas
- [ ] Integración con calendario
- [ ] Recordatorios automáticos

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el navegador permita LocalStorage
- Asegúrate de no tener el modo incógnito activado
- Comprueba en las herramientas del desarrollador (F12 > Application > LocalStorage)

### No puedo iniciar sesión
- Verifica que el email y contraseña sean correctos
- Asegúrate de haber seleccionado el rol correcto (Paciente/Médico)
- Intenta registrarte nuevamente

### Las citas no aparecen
- Verifica que hayas iniciado sesión con la cuenta correcta
- Asegúrate de que la cita no esté filtrada
- Revisa la consola (F12) para mensajes de error

## 📧 Contacto

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado libremente.

---

**¡Esperamos que disfrutes usando el Sistema de Citas Médicas!** 🏥✨
