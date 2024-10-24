import express from "express";
import clientController from "../controllers/clientController.js";

const router = express.Router();

// Rutas para clientes
router.get("/", clientController.getClients); // Obtener todos los clientes
router.post("/", clientController.createClient); // Crear un nuevo cliente
router.put("/:id", clientController.updateClient); // Actualizar un cliente
router.delete("/:id", clientController.deleteClient); // Eliminar un cliente
router.get("/search", clientController.searchClients); // Buscar un cliente

export default router;
