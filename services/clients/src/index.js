import createServer from "./server.js"; // Importar la configuración del servidor
import connectDB from "./utils/db.js"; // Importar la función de conexión a la base de datos

// Conectar a la base de datos
connectDB();

const app = createServer(); // Crear el servidor

// Leer el puerto desde el archivo .env o usar el puerto 5000 por defecto
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
