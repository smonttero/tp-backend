import express from 'express'
import { PORT } from  '../src/utils/config.js'
import { conectarDB } from '../src/utils/db.js'
import categoryRoutes from './routes/categoryRoute.js'

await conectarDB()

const app = express()

app.use(express.json())


//rutas
app.use('/categories', categoryRoutes)



app.use((req, res)=> {
  res.status(404).json({
    error: "Esa direccion no existe"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo http://localhost:${PORT}`)
})