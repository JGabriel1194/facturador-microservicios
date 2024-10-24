import Invoice from "../models/invoiceModel.js";
import { generateAccessKey } from "../utils/generateAccessKey.js";
import { generateSequential } from "../utils/generateSequential.js";
import { generateXML, signXML } from "../utils/sriUtils.js";
import { documentReception } from "../services/reception.js";
import { documentAuthorization } from "../services/authorization.js";

const billingController = {
  getInvoices: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const invoices = await Invoice.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
      const totalRows = await Invoice.countDocuments();

      res.status(200).json({
        success: true,
        data: invoices,
        meta: {
          total: totalRows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las facturas",
      });
    }
  },
  createInvoice: async (req, res) => {
    try {
      // Consultar el último secuencial en la base de datos y generar el siguiente
      const lastInvoice = await Invoice.findOne().sort({
        "invoice.infoTributaria.secuencial": -1,
      });

      // Generar el secuencial automáticamente
      let secuencial;
      if (lastInvoice) {
        secuencial = generateSequential(lastInvoice.invoice.infoTributaria);
      } else {
        secuencial = generateSequential(null);
      }
      req.body.infoTributaria.secuencial = secuencial;

      // Generar la clave de acceso automáticamente
      const claveAcceso = generateAccessKey(req.body);
      req.body.infoTributaria.claveAcceso = claveAcceso;

      //Formatear la fecha de emisión
      const fechaEmision = new Date(req.body.infoFactura.fechaEmision);
      const dia = String(fechaEmision.getDate()).padStart(2, "0");
      const mes = String(fechaEmision.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son 0-indexados
      const anio = fechaEmision.getFullYear();
      req.body.infoFactura.fechaEmision = `${dia}/${mes}/${anio}`;
      req.body.infoTributaria.ambiente = process.env.SRI_AMBIENTE;

      // Crea una nueva instancia del modelo Invoice con los datos recibidos del cuerpo de la petición
      const newInvoice = new Invoice({ invoice: req.body });

      // Generar el XML para el SRI
      const xmlData = generateXML(newInvoice.invoice);

      newInvoice.xmlGenerated = xmlData;

      // Guarda la factura en la base de datos
      await newInvoice.save();

      // Devuelve una respuesta exitosa con la factura creada
      res.status(201).json({
        success: true,
        message: "Factura creada exitosamente",
        data: newInvoice,
      });
    } catch (error) {
      // Si ocurre algún error, envía una respuesta de error con el mensaje adecuado
      res.status(500).json({
        success: false,
        message: "Error al crear la factura",
        error: error.message,
      });
      console.log(error);
    }
  },
  signInvoiceXml: async (req, res) => {
    try {
      const p12FilePath = req.filePath; // Archivo .p12 subido
      const { password, invoiceId } = req.body; // Contraseña y el ID de la factura

      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(400).json({
          success: false,
          message: "Documento no encontrado",
        });
      }

      const xmlDocument = invoice.xmlGenerated; // XML almacenado en la factura

      const signedXML = await signXML(p12FilePath, password, xmlDocument); // Firmar el XML con el archivo .p12

      // Actualizar el documento de la factura con el XML firmado
      invoice.xmlSigned = signedXML;
      invoice.status = "FIRMADO";
      await invoice.save();

      // Devolver el XML firmado
      res.status(200).json({
        success: true,
        message: "Documento firmado y guardado exitosamente",
        signedXML,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error al firmar el documento",
      });
    }
  },
  sendInvoiceToSRI: async (req, res) => {
    {
      try {
        // Obtener la factura desde la base de datos
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
          return res.status(400).json({
            success: false,
            message: "Documento no encontrado",
          });
        }

        // Enviar el XML firmado al SRI
        const estadoRecepcion = await documentReception(
          invoice.xmlSigned,
          process.env.SRI_RECEPCION_URL
        );

        res.status(200).json({
          success: true,
          message: "Factura enviada al SRI exitosamente",
          data: estadoRecepcion,
        });
      } catch (error) {
        console.error("Error procesando la factura:", error.message);
        throw error;
      }
    }
  },
  getAuthorization: async (req, res) => {
    try {
      const accesKey = req.params.key;
      const estadoAutorizacion = await documentAuthorization(
        accesKey,
        process.env.SRI_AUTHORIZATION_URL
      );

      res.status(200).json({
        success: true,
        message: "Factura autorizada en SRI exitosamente",
        data: estadoAutorizacion,
      });
    } catch (error) {
      console.error("Error procesando la factura:", error.message);
      throw error;
    }
  },
};

export default billingController;
