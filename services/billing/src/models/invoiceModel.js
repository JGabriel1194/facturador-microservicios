import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoice: {
      type: Object,
      required: true
      // infoTributaria: {
      //   ambiente: {
      //     type: Number,
      //     required: [true, "El ambiente es obligatorio"],
      //     default: 2,
      //   },
      //   tipoEmision: {
      //     type: Number,
      //     required: [true, "El tipo de emisión es obligatorio"],
      //   },
      //   razonSocial: {
      //     type: String,
      //     required: [true, "La razón social es obligatoria"],
      //   },
      //   ruc: {
      //     type: String,
      //     required: [true, "El RUC es obligatorio"],
      //   },
      //   claveAcceso: {
      //     type: String,
      //     required: [true, "La clave de acceso es obligatoria"],
      //   },
      //   codigoDoc: {
      //     type: String,
      //     required: [true, "El código del tipo de comprobante es obligatorio"],
      //   },
      //   estab: {
      //     type: String,
      //     required: [true, "El código del establecimiento es obligatorio"],
      //   },
      //   ptoEmi: {
      //     type: String,
      //     required: [true, "El código del punto de emisión es obligatorio"],
      //   },
      //   secuencial: {
      //     type: String,
      //     required: [true, "El código secuencial de la factura es obligatorio"],
      //   },
      //   dirMatriz: {
      //     type: String,
      //     required: [true, "La dirección matriz es obligatoria"],
      //   },
      // },
      // infoFactura: {
      //   fechaEmision: {
      //     type: Date,
      //     required: [true, "La fecha de emisión es obligatoria"],
      //     default: Date.now,
      //   },
      //   dirEstablecimiento: {
      //     type: String,
      //     required: [true, "La dirección del establecimiento es obligatoria"],
      //   },
      //   obligadoContabilidad: {
      //     type: String,
      //     required: false,
      //   },
      //   tipoIdentificacionComprador: {
      //     type: String,
      //     required: [
      //       true,
      //       "El tipo de identificación del comprador es obligatorio",
      //     ],
      //   },
      //   razonSocialComprador: {
      //     type: String,
      //     required: [true, "La razón social del comprador es obligatoria"],
      //   },
      //   identificacionComprador: {
      //     type: String,
      //     required: [true, "La identificación del comprador es obligatoria"],
      //   },
      //   totalSinImpuestos: {
      //     type: Number,
      //     required: [true, "El total sin impuestos es obligatorio"],
      //   },
      //   totalDescuento: {
      //     type: Number,
      //     required: [true, "El total del descuento es obligatorio"],
      //   },
      //   totalConImpuestos: {
      //     totalImpuesto: [
      //       {
      //         codigo: {
      //           type: String,
      //           required: [true, "El código del impuesto es obligatorio"],
      //         },
      //         codigoPorcentaje: {
      //           type: String,
      //           required: [true, "El código del porcentaje es obligatorio"],
      //         },
      //         baseImponible: {
      //           type: Number,
      //           required: [true, "La base imponible es obligatoria"],
      //         },
      //         valor: {
      //           type: Number,
      //           required: [true, "El valor del impuesto es obligatorio"],
      //         },
      //       },
      //     ],
      //   },
      //   propina: {
      //     type: Number,
      //     default: 0,
      //   },
      //   importeTotal: {
      //     type: Number,
      //     required: [true, "El importe total es obligatorio"],
      //   },
      //   moneda: {
      //     type: String,
      //     default: "USD",
      //   },
      //   pagos: {
      //     pago: [
      //       {
      //         formaPago: {
      //           type: String,
      //           required: [true, "La forma de pago es obligatoria"],
      //         },
      //         total: {
      //           type: Number,
      //           required: [true, "El total del pago es obligatorio"],
      //         },
      //         plazo: {
      //           type: String,
      //           required: false,
      //         },
      //         unidadTiempo: {
      //           type: String,
      //           required: false,
      //         },
      //       },
      //     ],
      //   },
      // },
      // detalles: {
      //   detalle: [
      //     {
      //       codigoPrincipal: {
      //         type: String,
      //         required: [
      //           true,
      //           "El código principal del producto es obligatorio",
      //         ],
      //       },
      //       descripcion: {
      //         type: String,
      //         required: [true, "La descripción del producto es obligatoria"],
      //       },
      //       cantidad: {
      //         type: Number,
      //         required: [true, "La cantidad es obligatoria"],
      //       },
      //       precioUnitario: {
      //         type: Number,
      //         required: [true, "El precio unitario es obligatorio"],
      //       },
      //       descuento: {
      //         type: Number,
      //         default: 0,
      //       },
      //       precioTotalSinImpuesto: {
      //         type: Number,
      //         required: [true, "El precio total sin impuesto es obligatorio"],
      //       },
      //       impuestos: {
      //         impuesto: [
      //           {
      //             codigo: {
      //               type: String,
      //               required: [true, "El código del impuesto es obligatorio"],
      //             },
      //             codigoPorcentaje: {
      //               type: String,
      //               required: [true, "El código del porcentaje es obligatorio"],
      //             },
      //             tarifa: {
      //               type: Number,
      //               required: [true, "La tarifa del impuesto es obligatoria"],
      //             },
      //             baseImponible: {
      //               type: Number,
      //               required: [true, "La base imponible es obligatoria"],
      //             },
      //             valor: {
      //               type: Number,
      //               required: [true, "El valor del impuesto es obligatorio"],
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
      // infoAdicional: {
      //   campoAdicional: [
      //     {
      //       type: String,
      //       default: "alejiss401997@gmail.com",
      //     },
      //   ],
      // },
    },
    xmlGenerated: { type: String },
    xmlSigned: { type: String },
    sxmSent: { type: String },
    xmlApproved: { type: String },
    xmlRejected: { type: String },
    rejectionReason: { type: String },
    status: {
      type: String,
      enum: ["GENERADO", "FIRMADO", "ENVIADO", "AUTORIZADO", "NO AUTORIZADO","DEVUELTO"],
      default: "GENERADO",
    },
    sriResponse: { type: String }, //Detalles de la respuesta del SRI
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
