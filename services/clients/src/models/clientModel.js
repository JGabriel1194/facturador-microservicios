import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  ciType:{
    type: Number,
    required: [true, "Debe especificar el tipo de documento de identificación"]
  },
  ci: {
    type: String,
    required: [false, "El número de CI/RUC/Pasaporte es obligatorio"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor ingrese un correo válido",
    ],
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  }
},{
  timestamps: true
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
