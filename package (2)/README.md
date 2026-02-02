# Sistema de Gestión de Eventos

## Descripción del Sistema

El **Sistema de Gestión de Eventos** es una aplicación web de tipo Single Page Application (SPA) desarrollada con tecnologías web modernas. Esta aplicación permite a los usuarios autenticarse, crear eventos, gestionar registros y administrar sus propios eventos de manera eficiente.

La aplicación está diseñada siguiendo los principios de arquitectura limpia y modular, separando las responsabilidades en capas bien definidas para facilitar el mantenimiento y la escalabilidad del código.

### Características Principales

El sistema ofrece una amplia gama de funcionalidades que cubren todos los aspectos de la gestión de eventos. En primer lugar, cuenta con un sistema de autenticación completo que permite a los usuarios registrarse con sus datos personales e iniciar sesión de manera segura. La aplicación utiliza `localStorage` para mantener la sesión activa entre visitas, proporcionando una experiencia de usuario fluida y continua.

Otra característica importante es la gestión completa de eventos, donde los usuarios pueden crear eventos con información detallada como título, descripción, fecha, ubicación y capacidad máxima. Los eventos creados pueden ser editados o eliminados por sus respectivos organizadores, garantizando que cada usuario tenga control total sobre su contenido.

El sistema de registro de asistentes permite a los usuarios registrarse en eventos de su interés, siempre y cuando haya disponibilidad de cupos. La aplicación implementa validaciones estrictas para evitar sobrepasar la capacidad máxima establecida para cada evento, notificando a los usuarios cuando un evento ha alcanzado su límite de participantes.

La interfaz de usuario es completamente responsiva y se adapta a diferentes tamaños de pantalla, permitiendo acceso desde dispositivos móviles, tablets y computadoras de escritorio. Además, incluye un sistema de notificaciones toast que proporciona retroalimentación inmediata al usuario sobre el resultado de sus acciones.

### Arquitectura del Proyecto

La arquitectura del proyecto sigue un patrón MVC (Model-View-Controller) adaptado para aplicaciones SPA. El código está organizado en módulos claramente separados que facilitan la comprensión y el mantenimiento del sistema.

El directorio principal contiene el archivo `index.html` que sirve como punto de entrada de la aplicación, una carpeta `css/` con todos los estilos visualesy una carpeta `js/` que contiene la lógica de la aplicación. Dentro de la carpeta JS, se encuentran los módulos principales (`app.js`, `router.js`, `api.js`, `auth.js`) y una subcarpeta `views/` con todas las vistas de la aplicación.

## Requisitos del Sistema

Para ejecutar esta aplicación, necesitarás tener instalado en tu sistema las siguientes herramientas. En primer lugar, necesitas un navegador web moderno como Google Chrome, Mozilla Firefox, Microsoft Edge o Safari que soporte las características modernas de JavaScript ES6+.

También necesitas tener instalado **Node.js** en su versión 14 o superior, que incluye npm (Node Package Manager) necesario para instalar y ejecutar json-server. Json-server es una herramienta que simula una API REST completa utilizando un archivo JSON como base de datos, permitiendo realizar operaciones CRUD sin necesidad de un servidor backend real.

## Instrucciones de Instalación

### Paso 1: Clonar o Descargar el Proyecto

Si tienes el código fuente en tu computadora, navega hasta la carpeta del proyecto. Si aún no tienes el código, copiarás todos los archivos en una carpeta local de tu preferencia.

### Paso 2: Instalar Dependencias

Para ejecutar el servidor de base de datos falso, necesitarás instalar json-server de forma global o local en tu proyecto. Abre una terminal en la carpeta del proyecto y ejecuta el siguiente comando para instalar json-server de manera global:

```bash
npm install -g json-server
```

Alternativamente, puedes instalarlo solo para tu proyecto:

```bash
npm install json-server
```

### Paso 3: Iniciar el Servidor de Base de Datos

Una vez instalado json-server, puedes iniciar el servidor con el archivo `db.json` que viene incluido en el proyecto. Ejecuta uno de los siguientes comandos en tu terminal:

Para json-server global:

```bash
json-server --watch db.json --port 3000
```

Para json-server local (si lo instalaste en el proyecto):

```bash
npx json-server --watch db.json --port 3000
```

El servidor iniciará en el puerto 3000 y podrás acceder a él en `http://localhost:3000`. Este servidor proporcionará los siguientes endpoints:

- `http://localhost:3000/users` - Endpoints para usuarios
- `http://localhost:3000/events` - Endpoints para eventos
- `http://localhost:3000/registrations` - Endpoints para registros

### Paso 4: Abrir la Aplicación

Una vez que el servidor de json-server esté ejecutándose, abre el archivo `index.html` en tu navegador web. Puedes hacerlo de varias maneras: arrastrando el archivo al navegador, usando la función "Abrir archivo" del navegador, o si tienes una extensión de servidor live, sirve la carpeta del proyecto.

**Importante:** La aplicación requiere que el servidor json-server esté ejecutándose para funcionar correctamente, ya que todas las operaciones de datos dependen de él.

## Datos de Prueba

El sistema viene preconfigurado con datos de prueba para facilitar las pruebas y el desarrollo. A continuación se detallan las cuentas de usuario disponibles:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@test.com | admin123 | Administrador |
| juan@test.com | juan123 | Usuario |
| maria@test.com | maria123 | Usuario |

Además, se incluyen eventos de ejemplo con diferentes características y algunos registros previos para demostrar el funcionamiento del sistema.

## Uso de la Aplicación

### Registro e Inicio de Sesión

Al acceder a la aplicación por primera vez, verás la página de inicio con información sobre el sistema. Para comenzar a utilizar todas las funcionalidades, puedes hacer clic en "Registrarse" para crear una nueva cuenta o "Iniciar Sesión" si ya tienes una cuenta existente.

El formulario de registro solicita tu nombre completo, email y contraseña. La contraseña debe tener al menos 6 caracteres. Una vez registrado, serás redirigido automáticamente a la sección de eventos.

El formulario de inicio de sesión solicita tu email y contraseña. Las credenciales se validan contra la base de datos y, si son correctas, se creará una sesión activa almacenada en localStorage.

### Gestión de Eventos

Una vez autenticado, puedes acceder a la sección "Eventos" para ver todos los eventos disponibles. Desde allí, puedes hacer clic en "Ver Detalles" de cualquier evento para ver más información y registrarte si lo deseas.

Si deseas crear un nuevo evento, haz clic en el botón "Crear Evento" en la página de eventos o en la navegación superior. Se te mostrará un formulario donde podrás ingresar el título, descripción, fecha, ubicación y capacidad máxima del evento. Todos los campos son obligatorios y el sistema validará que los datos sean correctos antes de crear el evento.

Como organizador de un evento, tendrás opciones adicionales para editar o eliminar tus propios eventos. Estas opciones solo son visibles para el creador del evento.

### Registro en Eventos

En la página de detalles de cada evento, puedes ver información completa incluyendo descripción, fecha, ubicación y número de registros actuales. Si el evento tiene cupos disponibles, encontrarás un botón para registrarte. Al registrarte, tu nombre aparecerá en la lista de asistentes.

Si posteriormente deseas cancelar tu registro, puedes hacerlo haciendo clic en el botón "Cancelar Mi Registro". El sistema te solicitará confirmación antes de procesar la cancelación.

La aplicación impedirá que te registres en un evento que ya ha alcanzado su capacidad máxima, mostrando un mensaje apropiado en la interfaz.

### Protección de Rutas

Las rutas que requieren autenticación están protegidas automáticamente. Si intentas acceder a la sección de eventos, crear un evento o ver detalles sin haber iniciado sesión, serás redirigido automáticamente a la página de inicio de sesión.

Tu sesión se mantiene activa incluso si cierras el navegador, gracias al almacenamiento en localStorage. Sin embargo, si cierras sesión manualmente o la sesión expira, tendrás que volver a autenticarte para acceder a las funcionalidades protegidas.

## Estructura de Archivos

La organización del proyecto es la siguiente:

```
event-manager-spa/
├── index.html              # Punto de entrada de la aplicación
├── db.json                 # Base de datos para json-server
├── README.md               # Documentación del proyecto
├── css/
│   └── styles.css         # Estilos globales de la aplicación
└── js/
    ├── app.js             # Punto de entrada principal
    ├── router.js          # Sistema de enrutamiento SPA
    ├── api.js             # Cliente HTTP para comunicación con API
    ├── auth.js            # Módulo de autenticación
    └── views/
        ├── home.js        # Vista de inicio
        ├── login.js       # Vista de inicio de sesión
        ├── register.js    # Vista de registro
        ├── events.js      # Vista de lista de eventos
        ├── createEvent.js # Vista de creación de eventos
        ├── editEvent.js   # Vista de edición de eventos
        └── eventDetail.js # Vista de detalles de evento
```

## Tecnologías Utilizadas

La aplicación fue desarrollada utilizando las siguientes tecnologías y conceptos. El lenguaje principal es **JavaScript ES6+**, aprovechando características modernas como clases, módulos, promesas y funciones flecha para un código más limpio y mantenible.

Para la estructura y estilos, se utiliza **HTML5 semántico** junto con **CSS3** con variables personalizadas, flexbox y grid layout para un diseño responsivo y moderno. No se utilizaron frameworks CSS externos para mantener el proyecto ligero y con fines educativos.

El sistema de enrutamiento está implementado utilizando la **History API** del navegador, permitiendo la navegación SPA sin recargas de página y soporte para los botones de avance y retroceso del navegador.

La persistencia de datos se realiza mediante **json-server**, una herramienta que simula una API REST completa sobre un archivo JSON. Las sesiones de usuario se mantienen utilizando **localStorage** del navegador.

## APIs y Endpoints

La aplicación interactúa con los siguientes endpoints de json-server:

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /users | Obtener todos los usuarios |
| GET | /users/:id | Obtener usuario por ID |
| GET | /users?email=:email | Buscar usuario por email |
| POST | /users | Crear nuevo usuario |
| PUT | /users/:id | Actualizar usuario |

### Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /events | Obtener todos los eventos |
| GET | /events/:id | Obtener evento por ID |
| GET | /events?organizerId=:id | Obtener eventos de un organizador |
| POST | /events | Crear nuevo evento |
| PUT | /events/:id | Actualizar evento |
| DELETE | /events/:id | Eliminar evento |

### Registros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /registrations | Obtener todos los registros |
| GET | /registrations?eventId=:id | Obtener registros de un evento |
| GET | /registrations?userId=:id | Obtener registros de un usuario |
| POST | /registrations | Crear nuevo registro |
| DELETE | /registrations/:id | Eliminar registro |

## Capturas de Pantalla

### Página de Inicio

La página de inicio presenta una interfaz limpia con información sobre el sistema y opciones para autenticarse. El diseño es completamente responsivo y se adapta a cualquier tamaño de pantalla.

### Formulario de Registro

El formulario de registro incluye validación en tiempo real para los campos, verificando que el email tenga un formato válido, que la contraseña tenga la longitud mínima requerida y que las contraseñas coincidan.

### Lista de Eventos

La vista de eventos muestra tarjetas con información resumida de cada evento, incluyendo fecha, ubicación, descripción truncada y contador de registros. Las opciones de edición solo son visibles para los organizadores.

### Detalles del Evento

La página de detalles muestra toda la información del evento, incluyendo descripción completa, lista de registrados y botón de registro para usuarios no organizados.

## Autor

**Nombre del Desarrollador:** [Tu Nombre]

**Correo Electrónico:** [Tu Email]

**Fecha de Creación:** 2024

**Institución/Curso:** [Nombre de la institución o curso]

Este proyecto fue desarrollado como parte de una evaluación práctica para demostrar conocimientos en desarrollo web con JavaScript vanilla, arquitectura SPA y consumo de APIs REST.

## Licencia

Este proyecto fue desarrollado con fines educativos y está disponible para su uso y modificación libre. No se incluye ninguna garantía implícita o explícita sobre su funcionamiento.

## Notas de Desarrollo

Durante el desarrollo de esta aplicación, se puso especial énfasis en el manejo de errores robusto utilizando bloques try-catch en todas las operaciones asíncronas. La validación de datos se realiza tanto en el cliente como en el servidor para garantizar la integridad de la información.

El sistema de toast notifications proporciona retroalimentación visual inmediata al usuario, mejorando significativamente la experiencia de usuario al Informar sobre el resultado de cada acción realizada.

La arquitectura modular permite fácilmente agregar nuevas funcionalidades o modificar las existentes sin afectar otras partes del sistema, siguiendo los principios de bajo acoplamiento y alta cohesión.
