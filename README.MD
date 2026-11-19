# 🥖 API REST — Panadería

API RESTful para gestionar el catálogo de productos de una panadería (panes, facturas, tortas y productos sin TACC). Permite crear, consultar, actualizar y eliminar productos, y organizarlos por categorías.

Está desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)**, aplicando separación de responsabilidades: los **controladores** manejan el pedido y la respuesta HTTP, y los **servicios** concentran la lógica de negocio y el acceso a la base de datos.

Incluye registro y login de usuarios, con contraseñas hasheadas con **bcrypt** y autenticación con **JWT**: las rutas que modifican datos (crear, actualizar y eliminar) solo pueden usarlas usuarios con rol de administrador. Las consultas (GET) son públicas.

Proyecto final del curso de Backend Developer — UTN FRBA.

---

## 📑 Índice

1. [Esquema de la base de datos](#-esquema-de-la-base-de-datos)
2. [Tecnologías utilizadas](#-tecnologías-utilizadas)
3. [Cómo correr el proyecto](#-cómo-correr-el-proyecto)
4. [Estructura del proyecto](#-estructura-del-proyecto)
5. [Endpoints](#-endpoints)
6. [Ejemplos de datos (mock)](#-ejemplos-de-datos-mock)
7. [Funcionalidades](#-funcionalidades)

---

## 🗄️ Esquema de la base de datos

Base de datos: `panaderia`.

```
categories 1 ──── N products
```

Un producto pertenece a **una** categoría (referencia por `_id`), y una categoría tiene **muchos** productos. La categoría no se embebe dentro del producto: se guarda en su propia colección porque se reutiliza en muchos productos, se consulta por sí sola (para armar menús y filtros) y tiene su propio ciclo de vida. Al leer productos, la API usa `populate` para devolver los datos completos de la categoría.

### Colección `categories`

| Campo | Tipo | Reglas |
|---|---|---|
| `_id` | ObjectId | Generado automáticamente |
| `name` | String | Obligatorio, único, entre 3 y 40 caracteres |
| `description` | String | Obligatorio, entre 3 y 200 caracteres |
| `createdAt` | Date | Automático |
| `updatedAt` | Date | Automático |

### Colección `products`

| Campo | Tipo | Reglas |
|---|---|---|
| `_id` | ObjectId | Generado automáticamente |
| `name` | String | Obligatorio, entre 3 y 60 caracteres |
| `description` | String | Obligatorio, entre 3 y 200 caracteres |
| `price` | Number | Obligatorio, mayor o igual a 0 |
| `stock` | Number | Obligatorio, entero, mayor o igual a 0 |
| `unit` | String | `unidad`, `docena`, `kg` o `porcion` (por defecto `unidad`) |
| `isGlutenFree` | Boolean | Por defecto `false` |
| `isAvailable` | Boolean | Por defecto `true` |
| `category` | ObjectId | Obligatorio. Referencia a `categories` |
| `createdAt` | Date | Automático |
| `updatedAt` | Date | Automático |

### Colección `users`

| Campo | Tipo | Reglas |
|---|---|---|
| `_id` | ObjectId | Generado automáticamente |
| `name` | String | Obligatorio, entre 3 y 60 caracteres |
| `email` | String | Obligatorio, único, en minúsculas, con formato de email válido |
| `password` | String | Obligatorio, mínimo 6 caracteres. Se guarda **hasheada** con bcrypt y nunca se devuelve en las respuestas |
| `role` | String | `admin` o `customer` (por defecto `customer`) |
| `isActive` | Boolean | Por defecto `true`. Un usuario inactivo no puede iniciar sesión |
| `createdAt` | Date | Automático |
| `updatedAt` | Date | Automático |

La colección `users` no se relaciona con las otras: se usa para la autenticación y para distinguir roles. La contraseña se hashea con un `pre-save hook` de Mongoose.

---

## 🛠️ Tecnologías utilizadas

- **Node.js** (módulos ES)
- **Express 5**: servidor y ruteo
- **MongoDB** y **Mongoose**: base de datos y modelado de datos
- **dotenv**: variables de entorno
- **cors**: habilitación de CORS
- **bcrypt**: hasheo de contraseñas
- **jsonwebtoken**: autenticación con JWT

---

## 🚀 Cómo correr el proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) instalado
- MongoDB corriendo en local (se puede usar [MongoDB Compass](https://www.mongodb.com/products/tools/compass) para ver los datos)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/smonttero/tp-backend.git
cd tp-backend

# 2. Instalar las dependencias
npm install
```

### Variables de entorno

El repositorio incluye un archivo `.env` con valores de ejemplo para una base local:

```env
MONGO_URI=mongodb://127.0.0.1:27017/panaderia
PORT=3000
JWT_SECRET=clave_secreta_de_ejemplo_cambiar
```

`JWT_SECRET` es la clave con la que se firman los tokens. El valor del repositorio es solo de ejemplo: en un proyecto real nunca se sube al repositorio.

También hay un `.env.example` con el mismo formato. Si usás otra conexión (por ejemplo MongoDB Atlas), cambiá `MONGO_URI`.

### Cargar los datos de ejemplo (opcional)

Los datos de ejemplo se pueden importar desde MongoDB Compass: creá la base `panaderia` y, en cada colección, usá **Add Data → Import JSON or CSV file**. Hay que importar los archivos de las colecciones `categories` y `products`. Los usuarios conviene crearlos desde la API (ver más abajo), porque los de `users.json` tienen contraseñas de ejemplo que no sirven para iniciar sesión.

### Ejecución

```bash
npm start
```

El servidor queda disponible en `http://localhost:3000`. La consola debe mostrar la conexión a la base y el mensaje `Servidor corriendo`.

### Crear un administrador

Los usuarios que se registran por la API siempre son `customer`: el rol no se puede elegir al registrarse, para que nadie pueda darse permisos de administrador. Para crear el primer administrador:

1. Registrá un usuario con `POST /users` (ver ejemplos más abajo).
2. En MongoDB Compass, abrí la colección `users`, editá ese documento y cambiá el campo `role` de `"customer"` a `"admin"`.
3. Iniciá sesión con `POST /users/login` y usá el token recibido para las rutas protegidas.

---

## 📁 Estructura del proyecto

```
tp-backend/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── src/
    ├── index.js              # Punto de entrada: Express, CORS y rutas
    ├── models/               # Esquemas de Mongoose
    │   ├── categoryModel.js
    │   ├── productModel.js
    │   └── userModel.js
    ├── services/             # Lógica de negocio y acceso a la base de datos
    │   ├── categoryService.js
    │   ├── productService.js
    │   └── userService.js
    ├── controllers/          # Manejo de request y response HTTP
    │   ├── categoryController.js
    │   ├── productController.js
    │   └── userController.js
    ├── routes/               # Definición de rutas
    │   ├── categoryRoute.js
    │   ├── productRoute.js
    │   └── userRoute.js
    ├── middleware/
    │   └── verifyToken.js    # Verifica el JWT y el rol de administrador
    ├── config/
    │   ├── config.js         # Lectura de variables de entorno
    │   └── db.js             # Conexión a MongoDB
    └── utils/
        └── ErrorApp.js       # Error personalizado con código HTTP
```

---

## 🔗 Endpoints

URL base: `http://localhost:3000`

Las rutas marcadas como **Admin** requieren enviar un token en el header `Authorization: Bearer <token>`, y que el usuario tenga rol `admin`. El token se obtiene con `POST /users/login`.

### Usuarios (`/users`)

| Método | Ruta | Descripción | Acceso | Código de éxito |
|---|---|---|---|---|
| POST | `/users` | Registra un usuario nuevo (rol `customer`) | Público | 201 |
| POST | `/users/login` | Inicia sesión y devuelve un token JWT | Público | 200 |

### Categorías (`/categories`)

| Método | Ruta | Descripción | Acceso | Código de éxito |
|---|---|---|---|---|
| GET | `/categories` | Lista todas las categorías | Público | 200 |
| POST | `/categories` | Crea una categoría | Admin | 201 |
| DELETE | `/categories/:id` | Elimina una categoría | Admin | 200 |

### Productos (`/products`)

| Método | Ruta | Descripción | Acceso | Código de éxito |
|---|---|---|---|---|
| GET | `/products` | Lista todos los productos (con su categoría completa) | Público | 200 |
| GET | `/products/:id` | Devuelve un producto por id (con su categoría completa) | Público | 200 |
| POST | `/products` | Crea un producto | Admin | 201 |
| PATCH | `/products/:id` | Actualiza los campos que se envían | Admin | 200 |
| DELETE | `/products/:id` | Elimina un producto | Admin | 200 |

### Códigos de error

| Código | Cuándo ocurre |
|---|---|
| 400 | Datos inválidos, id con formato incorrecto o categoría inexistente |
| 401 | Falta el token, es inválido o venció, o las credenciales del login son incorrectas |
| 403 | El token es válido, pero el usuario no es administrador |
| 404 | El recurso no existe, o la ruta no existe |
| 409 | Ya existe una categoría con ese nombre, o un usuario con ese email |
| 500 | Error interno del servidor |

Todas las respuestas de error tienen este formato:

```json
{ "error": "Mensaje que describe el problema" }
```

---

## 🧪 Ejemplos de datos (mock)

Las peticiones marcadas con 🔒 requieren el header `Authorization: Bearer <token>` de un administrador. Sin token responden **401**, y con el token de un cliente responden **403**:

```json
{ "error": "Token no proporcionado" }
```

```json
{ "error": "No tenés permisos para realizar esta acción" }
```

### `POST /users` (registro)

Body:

```json
{
  "name": "María Pérez",
  "email": "maria@mail.com",
  "password": "clave123"
}
```

Respuesta → **201**. La contraseña nunca se devuelve y el rol siempre es `customer`, aunque se envíe otro:

```json
{
  "_id": "6650bb22cc33dd44ee55ff66",
  "name": "María Pérez",
  "email": "maria@mail.com",
  "role": "customer",
  "isActive": true,
  "createdAt": "2026-11-15T12:30:00.000Z",
  "updatedAt": "2026-11-15T12:30:00.000Z"
}
```

Si el email ya está registrado → **409**:

```json
{ "error": "Ya existe un usuario con ese email" }
```

Si los datos no cumplen las reglas → **400**:

```json
{ "error": "La contraseña debe tener al menos 6 caracteres" }
```

### `POST /users/login`

Body:

```json
{
  "email": "maria@mail.com",
  "password": "clave123"
}
```

Respuesta → **200**. El token vence a la hora y se envía en el header de las rutas protegidas (`Authorization: Bearer <token>`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "_id": "6650bb22cc33dd44ee55ff66",
    "name": "María Pérez",
    "email": "maria@mail.com",
    "role": "customer",
    "isActive": true,
    "createdAt": "2026-11-15T12:30:00.000Z",
    "updatedAt": "2026-11-15T12:30:00.000Z"
  }
}
```

Si el email o la contraseña son incorrectos → **401** (el mensaje es el mismo en ambos casos):

```json
{ "error": "Credenciales inválidas" }
```

Si falta alguno de los dos datos → **400**:

```json
{ "error": "El email y la contraseña son obligatorios" }
```

### `GET /categories` → 200

```json
[
  {
    "_id": "665f1a2b3c4d5e6f7a8b1002",
    "name": "Facturas",
    "description": "Medialunas, vigilantes, cañoncitos y facturas surtidas.",
    "createdAt": "2026-10-01T10:06:00.000Z",
    "updatedAt": "2026-10-01T10:06:00.000Z"
  },
  {
    "_id": "665f1a2b3c4d5e6f7a8b1001",
    "name": "Panes",
    "description": "Panes de campo, de masa madre, integrales y más.",
    "createdAt": "2026-10-01T10:05:00.000Z",
    "updatedAt": "2026-10-01T10:05:00.000Z"
  }
]
```

### `POST /categories` 🔒

Body:

```json
{
  "name": "Sandwiches",
  "description": "Sandwiches de miga y tostados."
}
```

Respuesta → **201**:

```json
{
  "_id": "6650aa11bb22cc33dd44ee55",
  "name": "Sandwiches",
  "description": "Sandwiches de miga y tostados.",
  "createdAt": "2026-11-15T12:00:00.000Z",
  "updatedAt": "2026-11-15T12:00:00.000Z"
}
```

Si el nombre ya existe → **409**:

```json
{ "error": "Ya existe una categoría con ese nombre" }
```

Si falta un dato o no cumple las reglas → **400**:

```json
{ "error": "El nombre es demasiado corto" }
```

### `DELETE /categories/:id` 🔒 → 200

```json
{ "mensaje": "Categoría eliminada correctamente" }
```

Si el id no existe → **404**:

```json
{ "error": "Categoría no encontrada" }
```

### `GET /products` → 200

Cada producto incluye la categoría completa gracias a `populate`:

```json
[
  {
    "_id": "665f1a2b3c4d5e6f7a8b2001",
    "name": "Pan de campo",
    "description": "Pan rústico de corteza crocante, horneado todas las mañanas.",
    "price": 3200,
    "stock": 40,
    "unit": "unidad",
    "isGlutenFree": false,
    "isAvailable": true,
    "category": {
      "_id": "665f1a2b3c4d5e6f7a8b1001",
      "name": "Panes",
      "description": "Panes de campo, de masa madre, integrales y más.",
      "createdAt": "2026-10-01T10:05:00.000Z",
      "updatedAt": "2026-10-01T10:05:00.000Z"
    },
    "createdAt": "2026-10-02T08:00:00.000Z",
    "updatedAt": "2026-10-02T08:00:00.000Z"
  }
]
```

### `GET /products/:id` → 200

Devuelve un único objeto con la misma forma que cada elemento de la lista anterior. Si el id tiene formato inválido → **400** (`"El id no es válido"`). Si no existe → **404** (`"Producto no encontrado"`).

### `POST /products` 🔒

Body:

```json
{
  "name": "Pan de salvado",
  "description": "Pan casero con salvado, ideal para el desayuno.",
  "price": 3600,
  "stock": 20,
  "unit": "unidad",
  "isGlutenFree": false,
  "isAvailable": true,
  "category": "665f1a2b3c4d5e6f7a8b1001"
}
```

Respuesta → **201**: el producto creado, con la categoría completa.

Si la categoría no existe → **400**:

```json
{ "error": "La categoría indicada no existe" }
```

Si falta la categoría → **400**:

```json
{ "error": "La categoría es obligatoria" }
```

### `PATCH /products/:id` 🔒

Se envían solo los campos que se quieren cambiar:

```json
{
  "price": 3800,
  "stock": 15
}
```

Respuesta → **200**: el producto actualizado, con la categoría completa.

Si se envía un valor inválido, por ejemplo `{ "price": -5 }` → **400**:

```json
{ "error": "El precio no puede ser negativo" }
```

Si no se envía ningún campo válido → **400**:

```json
{ "error": "No se enviaron campos válidos para actualizar" }
```

### `DELETE /products/:id` 🔒 → 200

```json
{ "mensaje": "Producto eliminado correctamente" }
```

---

## ✅ Funcionalidades

### Implementadas

- CRUD completo de **productos**.
- Alta, listado y baja de **categorías**.
- Relación `products → categories` con `populate` en las lecturas.
- Verificación de que la categoría exista al crear o actualizar un producto.
- **Registro de usuarios** con contraseña hasheada (bcrypt) mediante un `pre-save hook`.
- **Login con JWT** (el token vence a la hora).
- **Middleware de autenticación y autorización**: las rutas de creación, actualización y eliminación solo las pueden usar administradores.
- El rol no se puede elegir al registrarse, para evitar que alguien se otorgue permisos de administrador.
- Validaciones en los modelos (campos obligatorios, longitudes, rangos y valores permitidos).
- Capa de servicios separada de los controladores.
- Manejo de errores con códigos HTTP apropiados (200, 201, 400, 401, 403, 404, 409, 500).
- Variables de entorno con `dotenv`.
- CORS habilitado.

### A futuro

- Colección de **pedidos**, para que los clientes armen compras que se retiran en el local.
- Endpoints para gestionar usuarios (listar, cambiar rol y cambiar contraseña) sin tener que editar la base a mano.
- Impedir la eliminación de una categoría que tenga productos asociados.
- Búsqueda por texto y filtros por categoría y por productos sin TACC.
- Restringir CORS a los dominios del front-end.