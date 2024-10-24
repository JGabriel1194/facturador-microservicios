import Category from "../models/categoryModel.js";

const categoryContoller = {
  //Obtener todas las categorias con paginación
  getCategories: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const categories = await Category.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
      const totalRows = await Category.countDocuments();

      res.status(200).json({
        success: true,
        data: categories,
        meta: {
          total: totalRows,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener las categorias" });
    }
  },

  //Crear nueva categoria
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();

      res.status(201).json({
        success: true,
        data: category,
        message: "Categoria creada exitosamente",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error, errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al crear la categoria",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al crear la categoria: el ${field} ya existe`,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error al crear la categoria",
        });
      }
      console.log(error);
    }
  },
  //Actualizar una categoria
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true, //Ejecutamos validadores al actualizar
        }
      );
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Categoria no encontrada",
        });
      }
      res.status(200).json({
        success: true,
        data: category,
        message: "Categoria actualizada exitosamente",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error, errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al actualizar la categoria",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al actualizar la categoria: el ${field} ya existe`,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error al actualizar el cliente",
        });
      }
      console.log(error);
    }
  },

  //Eliminar una caegoria
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Categoria no encontrada",
        });
      }
      res.status(200).json({
        success: true,
        data: category,
        message: "Categoria eliminada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar la categoria",
        error: error.message,
      });
    }
  },

  //Buscar categoria
  searchCategories: async (req, res) => {
    try {
      const { name } = req.query;
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      let searchCriteria = {};

      searchCriteria.name = { $regex: name, $options: "i" };

      //Buscar la categoria que coincida con los criterios
      const categories = await Category.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const totalRows = await Category.countDocuments(searchCriteria);

      if (totalRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No se encontraron categorias con los criterios especificados",
        });
      }

      res.status(200).json({
        success: true,
        data: categories,
        meta: {
          total: totalRows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener las categorias" });
    }
  },
};

export default categoryContoller;
