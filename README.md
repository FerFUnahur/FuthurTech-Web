# FuthurTech Web

Plataforma de robótica educativa.

**Tecnologías utilizadas:**

- **BackEnd:** Node.js, Express 5, Sequelize 6, SQLite, JWT, bcryptjs, CORS, dotenv, PDFKit, uuid
- **FrontEnd:** React 19, Vite 8, Bootstrap 5, react-bootstrap, Bootstrap Icons, React Router 7, Axios, React Aria
- **Prototipo legacy:** HTML5, CSS3, JavaScript

---

## Funcionalidades de la plataforma

- **Inicio de sesión y registro** — los usuarios pueden crear cuenta o iniciar sesión. Hay tres roles: administrador, instructor y estudiante.
- **Catálogo de productos** — explorar kits de robótica, accesorios y libros con fotos y precios.
- **Carrito de compras** — agregar productos, cambiar cantidades y ver el total. El carrito se guarda solo, aunque cierres el navegador.
- **Cursos online** — cada curso tiene módulos y lecciones con videos y contenido. Podés ver tu avance.
- **Progreso de aprendizaje** — marcás las lecciones como completadas y el sistema lleva la cuenta.
- **Panel de usuario (Dashboard)** — desde acá ves tus cursos, editás tu perfil y descargás certificados.
- **Panel de administración** — solo para administradores. Permite gestionar usuarios, cursos y pedidos desde un solo lugar.
- **Certificados PDF** — al completar un curso podés descargar un certificado con tu nombre.
- **Sitio web institucional** — las páginas de inicio, hardware, cursos, contacto, preguntas frecuentes y nosotros. También incluye un login demo, un dashboard de prueba y un perfil editable (corresponde al prototipo legacy).

---

## Estructura del proyecto

| Carpeta | Qué es | Tecnologías |
|---|---|---|
| `BackEnd/` | API del servidor | Node.js + Express + SQLite |
| `FrontEnd/` | Aplicación web moderna | React + Vite + Bootstrap |
| `Pagina web/` | Prototipo estático (opcional) | HTML + CSS + JS puro |

---

## Cómo ejecutar el proyecto en tu computadora

### Requisitos

- Tener instalado **Node.js** (versión 18 o superior).
- Tener **Git** instalado (opcional, solo si clonás el repositorio).
- Un navegador web (Chrome, Firefox, Edge).

---

### Paso 1: BackEnd (el servidor)

El servidor es el "motor" que maneja los datos. Tenés que ejecutarlo primero.

1. Abrí una terminal y movete a la carpeta del BackEnd:
   ```
   cd BackEnd
   ```

2. Instalá las dependencias:
   ```
   npm install
   ```
   (Esto descarga todo lo necesario para que el servidor funcione.)

3. Creá un archivo llamado `.env` dentro de la carpeta `BackEnd/` con el siguiente contenido:
   ```
   PORT=3001
   JWT_SECRET=futhurtech_secret_key_2026
   ```

4. Cargá los datos de demostración:
   ```
   npm run seed
   ```
   (Esto crea la base de datos con usuarios, productos, cursos y certificados de ejemplo.)

5. Iniciá el servidor:
   ```
   npm run dev
   ```
   Vas a ver un mensaje como: `Servidor corriendo en puerto 3001`. Dejá esta terminal abierta.

---

### Paso 2: FrontEnd (la página web)

La página web se conecta al servidor que ya iniciaste.

1. Abrí una **nueva terminal** (sin cerrar la del BackEnd) y movete a la carpeta del FrontEnd:
   ```
   cd FrontEnd
   ```

2. Instalá las dependencias:
   ```
   npm install
   ```

3. Iniciá la página:
   ```
   npm run dev
   ```
   Vas a ver un mensaje como: `http://localhost:5173/`. Abrí esa dirección en tu navegador.

---

### Paso 3: Usar la aplicación

Con el BackEnd y el FrontEnd funcionando, ya podés navegar la página web.

**Para iniciar sesión** usá cualquiera de estas cuentas de prueba:

| Rol | Correo electrónico | Contraseña |
|---|---|---|
| Administrador | admin@futhurtech.com | 123456 |
| Instructor | instructor@futhurtech.com | 123456 |
| Estudiante | student@futhurtech.com | 123456 |

- El **administrador** puede entrar al panel de administración.
- El **instructor** puede crear y editar cursos.
- El **estudiante** puede inscribirse a cursos y ver su progreso.

---

### (Opcional) Probar el prototipo estático

Si querés ver el diseño original del sitio no hace falta instalar nada. Simplemente abrí el archivo:

```
Pagina web/index.html
```

Haciendo doble clic o arrastrándolo al navegador. Las credenciales para este prototipo son:

- Correo: `admin@futhurtech.com`
- Contraseña: `admin123`

> Este prototipo es independiente y no necesita el servidor para funcionar.

---

### Resumen de comandos importantes

**BackEnd:**
| Comando | Qué hace |
|---|---|
| `npm run seed` | Carga los datos de prueba |
| `npm run dev` | Enciende el servidor |
| `npm run reset` | Borra todo y vuelve a cargar los datos |

**FrontEnd:**
| Comando | Qué hace |
|---|---|
| `npm run dev` | Enciende la página web |
| `npm run build` | Prepara la página para subir a un servidor real |

---

## Prototipo estático legacy (Pagina web/)

Esta carpeta contiene un prototipo del sitio hecho con HTML, CSS y JavaScript puro. No necesita instalación ni servidor — funciona directamente en el navegador guardando los datos en el almacenamiento local del navegador (localStorage).

**Páginas que incluye:**
- Inicio, Hardware (kits), Cursos, Contacto, FAQ, Nosotros
- Login demo, Dashboard de prueba, Perfil editable, Carrito vacío

**Para probarlo:**
1. Abrí `Pagina web/index.html` en tu navegador.
2. Andá a `login.html` desde el icono de usuario.
3. Iniciá sesión con `admin@futhurtech.com` / `admin123`.

> Este prototipo es independiente del resto del proyecto. Se mantiene como referencia visual del diseño original.

---

## Notas de mantenimiento

- El prototipo legacy usa `localStorage`. Al recargar o limpiar el navegador se pierden los datos guardados.
- Si modificás el footer del prototipo legacy, aplicá el cambio en todas las páginas HTML.
- El BackEnd no tiene migraciones: al ejecutar `npm run seed` se borra y recrea la base de datos completa.
- El FrontEnd no usa TypeScript — todo es JavaScript.
- Para agregar rutas protegidas usá los componentes `<ProtectedRoute>` (requiere inicio de sesión) o `<AdminRoute>` (requiere ser admin).
