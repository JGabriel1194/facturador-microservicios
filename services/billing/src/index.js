import createServer from "./server.js";
import connectDB from "./utils/db.js";

//Conectar a la base de datos
connectDB();

//Crear el servidor
const app = createServer();

// Leer el puerto desde el archivo .env o usar el puerto 3001 por defecto
const PORT = process.env.PORT || 3003;

//Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
