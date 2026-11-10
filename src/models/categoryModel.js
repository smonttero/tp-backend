import mongoose from "mongoose";
 
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minLength: [3, "El nombre es demasiado corto"],
      maxLength: [40, "El nombre no puede tener más de 40 caracteres"],
      trim: true,
      unique: true,
    },
 
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minLength: [3, "La descripción es demasiado corta"],
      maxLength: [200, "La descripción no puede tener más de 200 caracteres"],
      trim: true,
    },
  },
  { timestamps: true }
);
 
export const Category = mongoose.model("Category", categorySchema);