// Función para generar la clave de acceso
export const generateAccessKey = (invoiceData) => {

  // Clave de acceso según las reglas del SRI (Ejemplo)
  const date = new Date(invoiceData.infoFactura.fechaEmision)
  //   .toISOString()
  //   .slice(0, 10)
  //   .replace(/-/g, ""); // YYYYMMDD
  const fecha = formatDate(date)
  const tipoComprobante = invoiceData.infoTributaria.codDoc; // Ejemplo: 01 = Factura
  const ruc = invoiceData.infoTributaria.ruc; // RUC de la empresa
  const ambiente = invoiceData.infoTributaria.ambiente; // Ejemplo: 1 = Pruebas, 2 = Producción
  const estab = invoiceData.infoTributaria.estab.padStart(3, "0"); //
  const ptoEmi = invoiceData.infoTributaria.ptoEmi.padStart(3, "0"); //
  const secuencial = invoiceData.infoTributaria.secuencial.padStart(9, "0"); // Ejemplo: 000000001
  const randomNumber = generateRandomEightDigitNumber(); // Número aleatorio de 8 dígitos 
  const tipoEmision = invoiceData.infoTributaria.tipoEmision; //

  let claveAcceso = `${fecha}${tipoComprobante}${ruc}${ambiente}${estab}${ptoEmi}${secuencial}${randomNumber}${tipoEmision}`; // Agregar campos que correspondan

  // Calcular el dígito verificador
  const checkDigit = calculateCheckDigit(claveAcceso);

  // Agregar el dígito verificador al final de la clave de acceso
  claveAcceso += checkDigit;

  return claveAcceso;
};

// Función para calcular el dígito verificador (módulo 11)
const calculateCheckDigit = (claveAcceso) => {
  const coefficients = [2, 3, 4, 5, 6, 7];
  let total = 0;
  let coefficientIndex = 0;

  // Recorrer la clave desde el final al principio
  for (let i = claveAcceso.length - 1; i >= 0; i--) {
    const currentDigit = parseInt(claveAcceso[i], 10);
    total += currentDigit * coefficients[coefficientIndex];
    coefficientIndex = (coefficientIndex + 1) % coefficients.length;
  }

  const remainder = total % 11;
  let checkDigit;

  // Aplicar reglas para el dígito verificador
  if (remainder === 0) {
    checkDigit = 0;
  } else if (remainder === 10) {
    checkDigit = 1;
  } else {
    checkDigit = 11 - remainder;
  }

  return checkDigit;
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const newDate = day + month + year;
  return newDate;
};

const generateRandomEightDigitNumber = () => {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}