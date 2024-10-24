export interface BillingType {
  infoTributaria: {
    ambiente: number;
    tipoEmision: number;
    razonSocial: string;
    nombreComercial: string;
    ruc: string;
    claveAcceso: string;
    codDoc: string;
    estab: string;
    ptoEmi: string;
    secuencial: string;
    dirMatriz: string;
  };
  infoFactura: {
    fechaEmision: string;
    dirEstablecimiento: string;
    obligadoContabilidad: string;
    tipoIdentificacionComprador: string;
    razonSocialComprador: string;
    identificacionComprador: string;
    direccionComprador: string;
    totalSinImpuestos: number;
    totalDescuento: number;
    totalConImpuestos: {
      totalImpuesto: {
        codigo: number;
        codigoPorcentaje: number;
        baseImponible: number;
        valor: number;
      }[];
    };
    propina: number;
    importeTotal: number;
    pagos: {
      pago: {
        formaPago: string;
        total: number;
        plazo: number;
        unidadTiempo: string;
      }[];
    };
  };
  detalles: {
    detalle:{
      codigoPrincipal: string;
      codigoAuxiliar: string;
      descripcion: string;
      cantidad: number;
      precioUnitario: number;
      descuento: number;
      precioTotalSinImpuesto: number;
      impuestos: {
        impuesto: {
            codigo: number;
            codigoPorcentaje: number;
            tarifa: number;
            baseImponible: number;
            valor: number;
        };
      };
    }[];
  };
  infoAdicional: {
    campoAdicional: {
      _attributes: {
        nombre: string;
      };
      _text: string;
    }[];
  };
  status: string;
  _id: string;
  xmlGenerated: string;
  xmlSigned: string;
}
