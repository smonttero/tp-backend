import express from 'express'
import cors from 'cors'
import { PORT } from  './utils/config.js'
import { conectarDB } from './utils/db.js'
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoute.js'

await conectarDB()

const app = express()

app.use(cors())
app.use(express.json())


//rutas
app.use('/categories', categoryRoutes)

app.use('/products', productRoutes)



app.use((req, res)=> {
  res.status(404).json({
    error: "Esa direccion no existe"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo http://localhost:${PORT}`)
})