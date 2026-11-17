import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minLength: [3, "El nombre es demasiado corto"],
      maxLength: [60, "El nombre no puede tener más de 60 caracteres"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido"],
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minLength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, 
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "customer"],
        message: "El rol debe ser admin o customer",
      },
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // la contraseña nunca sale en una respuesta JSON
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);