# Futhur Tech Web

Documentacion del sitio web estatico de Futhur Tech. El proyecto presenta una plataforma de robotica educativa con informacion institucional, kits, cursos, contacto, login demo, dashboard, perfil editable y carrito vacio visual.

## Estado actual

El sitio esta construido con HTML, CSS y JavaScript puro. No usa backend, framework ni base de datos real. Las funciones de usuario se simulan con `localStorage` del navegador.

Archivos principales:

```text
Pagina web/
  index.html          Inicio del sitio
  hardware.html       Kits necesarios para los cursos
  cursos.html         Cursos autoasistidos
  contacto.html       Contacto y formulario
  faq.html            Preguntas frecuentes
  nosotros.html       Informacion institucional
  login.html          Inicio de sesion demo
  dashboard.html      Panel del usuario
  perfil.html         Edicion de datos personales
  carrito.html        Carrito vacio visual
  css/style.css       Estilos globales
  js/main.js          Logica e interacciones
README.md             Documentacion editable
README.pdf            Documentacion en PDF
```

## Como probarlo

No hace falta instalar dependencias. Se puede abrir directamente:

```text
Pagina web/index.html
```

Para probar el login:

```text
Email: admin@futhurtech.com
Contrasena: admin123
```

Flujo recomendado:

1. Abrir `index.html`.
2. Entrar a `login.html` desde el icono de usuario.
3. Iniciar sesion con las credenciales demo.
4. Se redirige a `dashboard.html`.
5. Desde el dashboard se puede entrar a `perfil.html` para editar datos.
6. Desde el icono de carrito se puede abrir `carrito.html`.

## Navegacion general

La navbar aparece en las paginas del sitio y contiene:

- `Inicio`: lleva a `index.html`.
- `Hardware`: lleva a `hardware.html`.
- `Cursos`: lleva a `cursos.html`.
- `Soporte`: lleva al footer con `#footer-soporte`.
- `Contacto`: lleva a `contacto.html`.
- Icono de usuario: lleva a `login.html`.
- Icono de carrito: lleva a `carrito.html`.

En `dashboard.html` tambien se muestra el carrito para que el usuario pueda acceder desde su cuenta.

## Paginas documentadas

### `index.html`

Es la pagina principal.

Incluye:

- Navbar principal.
- Hero con propuesta de valor.
- Botones hacia `cursos.html` y `hardware.html`.
- Seccion "Como funciona".
- Barra de cifras de Futhur Tech.
- Llamado a la accion hacia `contacto.html`.
- Footer unificado.

Sirve como entrada general al sitio.

### `hardware.html`

Muestra los kits disponibles o necesarios.

Incluye:

- Cards de kits.
- Informacion de componentes.
- Llamado a pedir asesoramiento.

Destino principal desde:

- Boton "Ver kits disponibles" en Inicio.
- Boton del carrito vacio.
- CTA final de Cursos, porque los cursos dependen del kit necesario.

### `cursos.html`

Muestra los cursos autoasistidos.

Importante:

- Los cursos no son pagos por separado.
- El acceso depende de contar con el kit correspondiente.
- Se eliminaron los precios de los cursos.

Cada curso muestra:

- Duracion.
- Nivel.
- Kit requerido.
- Modalidad online.
- Plan de estudios desplegable.

Cursos actuales:

- Robotica Inicial: requiere kit inicial.
- Robotica Avanzado: requiere kit avanzado.
- Programacion para Robots: requiere kit avanzado.

El CTA final lleva a `hardware.html`.

### `contacto.html`

Pagina de contacto.

Incluye:

- Formulario con campos obligatorios.
- Validacion visual desde `main.js`.
- Mensaje de confirmacion cuando se envia.
- Datos de contacto.

El formulario no envia datos a un servidor real. Solo simula el envio en el navegador.

### `faq.html`

Pagina de preguntas frecuentes.

Incluye acordeones que se abren y cierran con JavaScript.

Desde esta pagina se puede:

- Leer dudas comunes.
- Ir a contacto desde el llamado a la accion.

### `nosotros.html`

Pagina institucional.

Incluye:

- Historia de Futhur Tech.
- Mision y valores.
- Equipo.
- Diferenciales.
- CTA hacia contacto.

Usa estilos internos para algunas grillas especificas, ademas del CSS global.

### `login.html`

Pagina de inicio de sesion demo.

Incluye:

- Campo de email.
- Campo de contrasena.
- Boton para mostrar/ocultar contrasena.
- Mensaje de error si las credenciales no coinciden.

Si el login es correcto:

- Guarda una sesion en `localStorage`.
- Redirige a `dashboard.html`.

Si ya hay sesion activa y se entra a `login.html`, redirige automaticamente al dashboard.

### `dashboard.html`

Panel del usuario luego de iniciar sesion.

Incluye:

- Mensaje de bienvenida con el nombre del usuario.
- Email de la sesion.
- Boton para cerrar sesion.
- Accesos rapidos.
- Icono de carrito en la navbar.

Accesos rapidos:

- `Mis datos`: lleva a `perfil.html`.
- `Gestionar kits`: lleva a `hardware.html`.
- `Ver cursos`: lleva a `cursos.html`.
- `Soporte`: lleva a `contacto.html`.

Se quitaron las estadisticas del dashboard para dejarlo mas limpio.

Si no hay sesion activa, `main.js` redirige automaticamente a `login.html`.

### `perfil.html`

Pagina de datos personales del usuario.

Incluye:

- Nombre y apellido.
- Email.
- Telefono / WhatsApp.
- Ubicacion.
- Fecha de nacimiento.
- Curso actual.
- Notas personales.

El email queda en modo lectura para identificar al usuario.

Los datos se guardan en `localStorage` dentro de `ft_users`. Al guardar:

- Se actualiza el usuario.
- Se actualiza la sesion.
- Se muestra el mensaje "Cambios guardados correctamente".

No se cargan por defecto telefono ni ubicacion. Los campos aparecen vacios salvo que el usuario ya los haya completado.

Si no hay sesion activa, redirige a `login.html`.

### `carrito.html`

Pagina creada para evitar error al hacer click en el carrito.

Actualmente muestra un estado vacio:

- Icono visual de carrito vacio en color Futhur Tech.
- Texto "Tu carrito esta vacio".
- Explicacion breve.
- Boton "Ver kits disponibles".

El boton lleva a:

```text
hardware.html
```

Todavia no hay logica real de carrito ni productos agregables.

## Footer

El footer esta unificado en todas las paginas.

Incluye:

- Link a `nosotros.html`.
- Link a `faq.html`.
- Link a `contacto.html`.
- Email.
- Telefono.
- Ubicacion.
- Redes sociales.
- Copyright.

El footer tiene `id="footer-soporte"` para que el link "Soporte" de la navbar pueda llevar a esa zona.

Para evitar problemas de codificacion, el texto "Quienes somos" en el footer usa entidad HTML:

```html
Qui&eacute;nes somos
```

## CSS

Archivo:

```text
Pagina web/css/style.css
```

Contiene:

- Variables globales de color y medidas.
- Reset basico.
- Navbar responsive.
- Hero principal.
- Barra de cifras.
- Secciones generales.
- Cards de cursos y hardware.
- Acordeones.
- Formularios.
- CTA.
- Footer.
- Login.
- Dashboard.
- Perfil.
- Carrito vacio.
- Media queries para mobile.

Colores principales:

- Verde: `--green`
- Fondo claro: `--bg-light`
- Fondo oscuro: `--bg-dark`
- Texto oscuro: `--text-dark`
- Texto claro: `--text-light`

## JavaScript

Archivo:

```text
Pagina web/js/main.js
```

Funciones principales:

- Crea el usuario demo si no existe.
- Limpia telefono y ubicacion viejos del usuario demo si estaban precargados.
- Controla el menu hamburguesa.
- Cierra el menu mobile al tocar un link.
- Marca el link activo de la navbar.
- Maneja acordeones.
- Maneja simulador de presupuesto si existe en una pagina.
- Valida el formulario de contacto.
- Procesa login demo.
- Permite mostrar/ocultar contrasena.
- Protege `dashboard.html`.
- Protege `perfil.html`.
- Carga y guarda datos personales.
- Cierra sesion.
- Redirige desde login al dashboard si ya hay sesion.

## localStorage

El sitio usa almacenamiento local del navegador.

Claves:

```text
ft_users     Lista de usuarios demo
ft_session   Sesion activa
```

Ejemplo de usuario:

```js
{
  email: 'admin@futhurtech.com',
  password: 'admin123',
  name: 'Admin',
  phone: '',
  location: '',
  birthdate: '',
  course: 'Robotica Inicial',
  bio: ''
}
```

Esto es solo para maqueta. Para produccion deberia reemplazarse por:

- Backend real.
- Base de datos.
- Autenticacion segura.
- Hash de contrasenas.
- Validacion del lado servidor.

## Flujo de usuario

```text
login.html
  -> valida usuario en localStorage
  -> guarda ft_session
  -> redirige a dashboard.html

dashboard.html
  -> verifica ft_session
  -> muestra bienvenida
  -> permite ir a perfil.html, hardware.html, cursos.html o contacto.html

perfil.html
  -> verifica ft_session
  -> carga datos desde ft_users
  -> permite editar
  -> guarda cambios en ft_users

logout
  -> borra ft_session
  -> vuelve a login.html
```

## Cambios recientes importantes

- Se unifico el footer en todas las paginas.
- Se corrigio el texto del footer para evitar `qui?nes somos`.
- Se agrego `perfil.html`.
- Se agrego acceso "Mis datos" al dashboard.
- Se quitaron las estadisticas del dashboard.
- Se agrego carrito visible en el dashboard.
- Se creo `carrito.html`.
- Se agrego estado visual de carrito vacio.
- Se quitaron precios de cursos.
- Se aclaro que los cursos dependen del kit necesario.
- Se cambio el CTA final de cursos hacia `hardware.html`.
- Se quitaron telefono y ubicacion precargados en Mis datos.

## Notas de mantenimiento

- Si se modifica el footer, conviene aplicar el cambio en todas las paginas.
- Si se cambian rutas de paginas, revisar navbar, dashboard y botones CTA.
- Si se agregan cursos, indicar kit requerido en vez de precio.
- Si se agrega carrito real, `carrito.html` deberia leer productos desde `localStorage` o backend.
- Si se agrega backend, reemplazar la logica demo de `main.js`.
- Mantener archivos en UTF-8 para evitar problemas con tildes.

