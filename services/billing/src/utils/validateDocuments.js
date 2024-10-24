// Función para validar el RUC
export const validateRUC = (ruc) => {
  if (!ruc || ruc.length !== 13 || isNaN(ruc)) {
    throw new Error("El RUC debe contener 13 dígitos numéricos.");
  }

  const cedula = ruc.substring(0, 10); // Primeros 10 dígitos

  // Validar que los primeros 10 dígitos sean una cédula válida
  if (!validateCedula(cedula)) {
    throw new Error(
      "Los primeros 10 dígitos del RUC no son una cédula válida."
    );
  }

  // Validar que los últimos 3 dígitos sean 001
  const establecimiento = ruc.substring(10, 13);
  if (establecimiento !== "001") {
    throw new Error("Los últimos 3 dígitos del RUC deben ser 001.");
  }

  return true;
};

// Función para validar la cédula
export const validateCedula = (cedula) => {
  if (cedula.length !== 10 || isNaN(cedula)) {
    return false;
  }

  const provinceCode = parseInt(cedula.substring(0, 2), 10);
  if (provinceCode < 1 || provinceCode > 24) {
    return false;
  }

  const thirdDigit = parseInt(cedula[2], 10);
  if (thirdDigit < 0 || thirdDigit > 6) {
    return false;
  }

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let total = 0;

  for (let i = 0; i < coefficients.length; i++) {
    let value = coefficients[i] * parseInt(cedula[i], 10);
    if (value >= 10) {
      value -= 9;
    }
    total += value;
  }

  const checkDigit = parseInt(cedula[9], 10);
  const calculatedCheckDigit = (10 - (total % 10)) % 10;

  return checkDigit === calculatedCheckDigit;
};
