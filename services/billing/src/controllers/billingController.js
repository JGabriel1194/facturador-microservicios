import Invoice from "../models/invoiceModel.js";
import { generateAccessKey } from "../utils/generateAccessKey.js";
import { generateSequential } from "../utils/generateSequential.js";
import { generateXML, signXML } from "../utils/sriUtils.js";
import { documentReception } from "../services/reception.js";
import { documentAuthorization } from "../services/authorization.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import xml2js from "xml2js";

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
  getXMLFile: async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        return res.status(400).json({
          success: false,
          message: "Documento no encontrado",
        });
      }

      // Asegúrate de que invoice.xmlSigned sea un string XML válido
      const xmlContent = invoice.xmlSigned;

      // Configura las cabeceras para la descarga del archivo
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=factura_${invoice.invoice.infoTributaria.claveAcceso}.xml`
      );
      res.setHeader("Content-Type", "application/xml");

      // Envía el contenido XML como respuesta
      res.send(xmlContent);

    } catch (error) {
      console.error("Error al obtener el archivo XML:", error.message);
      throw error;
    }
  },
  getPDFFile: async (req, res) => {
    console.log("Obteniendo archivo PDF");
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        return res.status(400).json({
          success: false,
          message: "Documento no encontrado",
        });
      }

      // Parse XML to JSON
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: true,
      });

      const parsedInvoice = await parser.parseStringPromise(invoice.xmlSigned);

      //xml2js.parseStringPromise(invoice.xmlSigned);

      // Extract data from parsed XML
      const infoTributaria = parsedInvoice.factura.infoTributaria[0];
      const infoFactura = parsedInvoice.factura.infoFactura[0];
      const detalles = parsedInvoice.factura.detalles[0].detalle;
      const infoAdicional =
        parsedInvoice.factura.infoAdicional[0].campoAdicional;

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      const { width, height } = page.getSize();
      const fontSize = 10;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add content to PDF
      let yPosition = height - 50;
      const lineHeight = 20;

      const drawText = (text, x, y, options = {}) => {
        page.drawText(text, {
          x,
          y,
          size: options.fontSize || fontSize,
          font: options.font || font,
          color: options.color || rgb(0, 0, 0),
        });
      };

      const drawLine = (y) => {
        page.drawLine({
          start: { x: 50, y },
          end: { x: width - 50, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      };

      const addNewPage = () => {
        page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        yPosition = height - 50;
      };

      // Encabezado
      drawText("FACTURA", 50, yPosition, { fontSize: 16 });
      yPosition -= lineHeight * 2;

      drawText("Información Tributaria", 50, yPosition, { fontSize: 14 });
      yPosition -= lineHeight;
      drawText(`RUC: ${infoTributaria.ruc}`, 50, yPosition);
      drawText(
        `Clave de Acceso: ${infoTributaria.claveAcceso}`,
        300,
        yPosition
      );
      yPosition -= lineHeight;
      drawText(`Razón Social: ${infoTributaria.razonSocial}`, 50, yPosition);
      drawText(
        `Nombre Comercial: ${infoTributaria.nombreComercial}`,
        300,
        yPosition
      );
      yPosition -= lineHeight;
      drawText(`Secuencial: ${infoTributaria.secuencial}`, 50, yPosition);
      drawText(`Fecha de Emisión: ${infoFactura.fechaEmision}`, 300, yPosition);
      yPosition -= lineHeight;

      drawText(`Dirección Matriz: ${infoTributaria.dirMatriz}`, 50, yPosition);
      yPosition -= lineHeight;

      drawLine(yPosition);
      yPosition -= lineHeight;

      // Información de la Factura
      drawText("Información de la Factura", 50, yPosition, { fontSize: 14 });
      yPosition -= lineHeight;
      drawText(
        `Razón Social Comprador: ${infoFactura.razonSocialComprador}`,
        50,
        yPosition
      );
      drawText(
        `Identificación Comprador: ${infoFactura.identificacionComprador}`,
        300,
        yPosition
      );
      yPosition -= lineHeight;
      drawText(
        `Total Sin Impuestos: ${infoFactura.totalSinImpuestos}`,
        50,
        yPosition
      );
      drawText(
        `Total Descuento: ${infoFactura.totalDescuento}`,
        300,
        yPosition
      );
      yPosition -= lineHeight;
      drawText(`Importe Total: ${infoFactura.importeTotal}`, 50, yPosition);
      yPosition -= lineHeight;

      drawLine(yPosition);
      yPosition -= lineHeight;

      // Detalles
      drawText("Detalles", 50, yPosition, { fontSize: 14 });
      yPosition -= lineHeight;
      drawText("Código Principal", 50, yPosition);
      drawText("Descripción", 150, yPosition);
      drawText("Cantidad", 300, yPosition);
      drawText("Precio Unitario", 400, yPosition);
      drawText("Precio Total", 500, yPosition);
      yPosition -= lineHeight;

      detalles.forEach((detalle) => {
        if (yPosition < 50) addNewPage();

        drawText(String(detalle.codigoPrincipal), 50, yPosition);
        drawText(String(detalle.descripcion), 150, yPosition);
        drawText(String(detalle.cantidad), 300, yPosition);
        drawText(String(detalle.precioUnitario), 400, yPosition);
        drawText(String(detalle.precioTotalSinImpuesto), 500, yPosition);
        yPosition -= lineHeight;
      });

      yPosition -= lineHeight;

      drawLine(yPosition);
      yPosition -= lineHeight;

      // Información Adicional
      drawText("Información Adicional", 50, yPosition, { fontSize: 14 });
      yPosition -= lineHeight;

      infoAdicional.forEach((campo) => {
        if (yPosition < 50) addNewPage();

        drawText(`${campo.nombre}: ${campo.valor}`, 50, yPosition);
        yPosition -= lineHeight;
      });

      drawLine(yPosition);

      // Guardar el PDF
      const pdfBytes = await pdfDoc.save();


      res.setHeader(
        "Content-Disposition",
        `attachment; filename=factura_${infoTributaria.secuencial}.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error("Error al obtener el archivo PDF:", error.message);
      throw error;
    }
  }
};

export default billingController;
