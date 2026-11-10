import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    minLength: [3, "El nombre es demasiado corto"],
    maxLength: [30, "El nombre no puede tener mas de 30 caracteres"],
    required: true,
    trim: true,
    lowercase: true,
  },

  description: {
    type: String,
    minLength: [3, "La descripción es demasiada corto"],
    maxLength: [50, "La descripción no puede tener mas de 50 caracteres"],
    required: true,
    trim: true,
    lowercase: true,
  },

  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },

  stock: {
    type: Number,
    required: [true, "El stock es obligatorio"],
    min: [0, "El stock no puede ser negativo"],
    validate: {
      validator: Number.isInteger,
      message: "El stock tiene que ser un numero entero",
    },
  }
  

});
