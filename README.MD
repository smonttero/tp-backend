# 🥖 API REST — Panadería

API RESTful para gestionar el catálogo de productos de una panadería (panes, facturas, tortas y productos sin TACC). Permite crear, consultar, actualizar y eliminar productos, y organizarlos por categorías.

Está desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)**, aplicando separación de responsabilidades: los **controladores** manejan el pedido y la respuesta HTTP, y los **servicios** concentran la lógica de negocio y el acceso a la base de datos.

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

---

## 🛠️ Tecnologías utilizadas

- **Node.js** (módulos ES)
- **Express 5**: servidor y ruteo
- **MongoDB** y **Mongoose**: base de datos y modelado de datos
- **dotenv**: variables de entorno
- **cors**: habilitación de CORS

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
```

También hay un `.env.example` con el mismo formato. Si usás otra conexión (por ejemplo MongoDB Atlas), cambiá `MONGO_URI`.

### Cargar los datos de ejemplo (opcional)

Los datos de ejemplo se pueden importar desde MongoDB Compass: creá la base `panaderia` y, en cada colección, usá **Add Data → Import JSON or CSV file**. Hay que importar los archivos de las colecciones `categories` y `products`.

### Ejecución

```bash
npm start
```

El servidor queda disponible en `http://localhost:3000`. La consola debe mostrar la conexión a la base y el mensaje `Servidor corriendo`.

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
    │   └── productModel.js
    ├── services/             # Lógica de negocio y acceso a la base de datos
    │   ├── categoryService.js
    │   └── productService.js
    ├── controllers/          # Manejo de request y response HTTP
    │   ├── categoryController.js
    │   └── productController.js
    ├── routes/               # Definición de rutas
    │   ├── categoryRoute.js
    │   └── productRoute.js
    ├── config/
    │   ├── config.js         # Lectura de variables de entorno
    │   └── db.js             # Conexión a MongoDB
    └── utils/
        └── ErrorApp.js       # Error personalizado con código HTTP
```

---

## 🔗 Endpoints

URL base: `http://localhost:3000`

### Categorías (`/categories`)

| Método | Ruta | Descripción | Código de éxito |
|---|---|---|---|
| GET | `/categories` | Lista todas las categorías | 200 |
| POST | `/categories` | Crea una categoría | 201 |
| DELETE | `/categories/:id` | Elimina una categoría | 200 |

### Productos (`/products`)

| Método | Ruta | Descripción | Código de éxito |
|---|---|---|---|
| GET | `/products` | Lista todos los productos (con su categoría completa) | 200 |
| GET | `/products/:id` | Devuelve un producto por id (con su categoría completa) | 200 |
| POST | `/products` | Crea un producto | 201 |
| PATCH | `/products/:id` | Actualiza los campos que se envían | 200 |
| DELETE | `/products/:id` | Elimina un producto | 200 |

### Códigos de error

| Código | Cuándo ocurre |
|---|---|
| 400 | Datos inválidos, id con formato incorrecto o categoría inexistente |
| 404 | El recurso no existe, o la ruta no existe |
| 409 | Ya existe una categoría con ese nombre |
| 500 | Error interno del servidor |

Todas las respuestas de error tienen este formato:

```json
{ "error": "Mensaje que describe el problema" }
```

---

## 🧪 Ejemplos de datos (mock)

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

### `POST /categories`

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

### `DELETE /categories/:id` → 200

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

### `POST /products`

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

### `PATCH /products/:id`

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

### `DELETE /products/:id` → 200

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
- Validaciones en los modelos (campos obligatorios, longitudes, rangos y valores permitidos).
- Capa de servicios separada de los controladores.
- Manejo de errores con códigos HTTP apropiados (200, 201, 400, 404, 409, 500).
- Variables de entorno con `dotenv`.
- CORS habilitado.

### A futuro

- Colección de **usuarios** con roles (administrador y cliente) y contraseñas hasheadas con bcrypt.
- **Autenticación con JWT** (login) y middleware para proteger las rutas de creación, actualización y eliminación.
- Colección de **pedidos**, para que los clientes armen compras que se retiran en el local.
- Impedir la eliminación de una categoría que tenga productos asociados.
- Búsqueda por texto y filtros por categoría y por productos sin TACC.
- Restringir CORS a los dominios del front-end.