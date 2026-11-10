import express from 'express'
import { PORT } from './utils/config.js'
import { conectarDB } from './db.js'

await conectarDB()

const app = express()

app.use(express.json())


//rutas




app.use((req, res)=> {
  res.status(404).json({
    error: "Esa direccion no existe"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo http://localhost:${PORT}`)
})