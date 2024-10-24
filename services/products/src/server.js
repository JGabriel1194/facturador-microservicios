import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"

dotenv.config(); //cargar variables de entorno

//Función para configurar el servidor
const createServer = () => {
    const app = express();

    //Middlewares
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(cors());

    //Rutas
    app.use('/api/categories',categoryRoutes)
    app.use('/api/products', productRoutes)
    
    //Manejo de errores
    app.use ((err,req,res,next) => {
        console.log(err.stack)
        res.status(500).send("Error en el servidor");
    })

    return app;
};

export default createServer;