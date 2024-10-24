// Función para generar el secuencial
export const generateSequential = (infoTributaria) => {
  
  let nextSequential = "000000001"; // Inicia el secuencial en 1 si no hay facturas previas

  if (infoTributaria) {
    
    const currentSequential = parseInt(
      infoTributaria.secuencial,
      10
    );
    nextSequential = (currentSequential + 1).toString().padStart(9, "0"); // Aumenta el secuencial
  }

  return nextSequential;
};
