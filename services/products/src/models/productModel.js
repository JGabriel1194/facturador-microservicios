import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "El codigo del producto o servicio es obligatorio"],
    },
    name: {
      type: String,
      required: [true, "El nombre del producto o servicio es obligatorio"],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio del producto o servicio es obligatorio"],
      mmin: 0,
    },
    tax: {
      type: Number,
      required: [true, "El impuesto del producto o servicio es obligatorio"],
      min: 0,
      max: 100, // El impuesto sera un porcentaje de 0 a 100
      default: 15, // Valor de iva por defecto 15%
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category", //Referencia del modelo de categoria,
    //   required: true,
    // },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//Campo virtual para calcular el precio total (price * tax)
productSchema.virtual("totalPrice").get(function () {
  return this.price + (this.price * this.tax) / 100;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
