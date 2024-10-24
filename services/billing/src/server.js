import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import billingRoutes from './routes/billingRoutes.js'

dotenv.config(); //cargar variables de entorno

//Función para configurar el servidor
const createServer = () => {
  const app = express();

  //Middlewares
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(cors());

  //Rutas
  app.use('/api/billings',billingRoutes)

  //Manejo de errores
  app.use((err, req, res, next) => {
    res.status(500).send("Error en el servidor");
  });

  return app;
};

export default createServer;
