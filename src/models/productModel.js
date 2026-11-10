import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minLength: [3, "El nombre es demasiado corto"],
      maxLength: [60, "El nombre no puede tener más de 60 caracteres"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minLength: [3, "La descripción es demasiado corta"],
      maxLength: [200, "La descripción no puede tener más de 200 caracteres"],
      trim: true,
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
        message: "El stock tiene que ser un número entero",
      },
    },

    unit: {
      type: String,
      enum: {
        values: ["unidad", "docena", "kg", "porcion"],
        message: "La unidad debe ser: unidad, docena, kg o porcion",
      },
      default: "unidad",
    },

    isGlutenFree: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);