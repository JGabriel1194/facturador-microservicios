import Client from "../models/clientModel.js";

const clientController = {
  // Obtener todos los clientes con paginación
  getClients: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const clients = await Client.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
      const totalRows = await Client.countDocuments();

      res.status(200).json({
        success: true,
        data: clients,
        meta: {
          total: totalRows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error al obtener clientes" });
    }
  },

  // Crear un nuevo cliente
  createClient: async (req, res) => {
    try {
      const { name, email, phone, address, ciType, ci } = req.body;
      const client = new Client({ name, email, phone, address,ciType, ci });
      await client.save();
      res.status(201).json({
        success: true,
        data: client,
        message: "Cliente creado exitosamente",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al crear el cliente",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al crear el cliente: el ${field} ya existe`,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error al crear el cliente" });
      }
      console.error(error);
    }
  },

  // Actualizar un cliente
  updateClient: async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, // Ejecutar validadores al actualizar
      });
      if (!client) {
        return res
          .status(404)
          .json({ success: false, message: "Cliente no encontrado" });
      }
      res.status(200).json({
        success: true,
        data: client,
        message: "Cliente actualizado exitosamente",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al actualizar el cliente",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al crear el cliente: el ${field} ya existe`,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error al actualizar el cliente" });
      }
      console.error(error);
    }
  },

  // Eliminar un cliente
  deleteClient: async (req, res) => {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        data: client,
        message: "Cliente eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el cliente",
        error: error.message,
      });
    }
  },

  // Buscar cliente
  searchClients: async (req, res) => {
    try {
      // Extraer los parámetros de búsqueda de la query
      const { name, email, ci, page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      
      let searchCriteria = {};

      // Agregar condiciones de búsqueda solo si se proporcionan en la query
      if (name && ci && email) {
        searchCriteria = {
          $or: [
            { name: { $regex: new RegExp(name.toString(), "i") } },
            { ci: { $regex: new RegExp(ci.toString(), "i") } },
            { email: { $regex: new RegExp(email.toString(), "i") } },
          ],
        };
      } else if (name) {
        searchCriteria.name = { $regex: new RegExp(name.toString(), "i") };
      } else if (ci) {
        searchCriteria.ci = { $regex: new RegExp(ci.toString(), "i") };
      } else if (email) {
        searchCriteria.email = { $regex: new RegExp(email.toString(), "i") };
      }
      //if (phone) searchCriteria.phone = phone; // Búsqueda exacta

      // Buscar clientes que coincidan con los criterios
      const clients = await Client.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .exec();

      const totalRows = await Client.countDocuments(searchCriteria);

      res.status(200).json({
        success: true,
        data: clients,
        meta: {
          total: totalRows,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalRows / limit),
        },
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los clientes",
      });
    }
  },
};

export default clientController;
