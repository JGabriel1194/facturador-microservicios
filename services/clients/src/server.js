import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js"; // Rutas de clientes (puedes agregar más rutas)
import morgan from "morgan";
import cors from "cors";

dotenv.config(); // Cargar variables de entorno

// función para configurar el servidor
const createServer = () => {
  const app = express();

  // Middleware
  app.use(bodyParser.json()); // Parsear JSON en las solicitudes
  app.use(morgan("dev")); // Mostrar las solicitudes en la consola
  app.use(cors()); // Habilitar CORS

  // Rutas
  app.use("/api/clients", clientRoutes); // Ruta para la gestión de clientes

  // Middleware para manejar errores
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error en el servidor");
  });

  return app;
};

export default createServer;
