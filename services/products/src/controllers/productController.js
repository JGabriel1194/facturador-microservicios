import Product from "../models/productModel.js";

const productController = {
  //Obtener todos los productos
  getProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const products = await Product.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .exec();
      const totalRows = await Product.countDocuments();

      res.status(200).json({
        success: true,
        data: products,
        meta: {
          total: totalRows,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos",
      });
    }
  },

  //Crear nevo producto
  createProduct: async (req, res) => {
    try {
      const { code, name, description, price, tax, category, available } = req.body;
      
      const product = new Product({
        code,
        name,
        description,
        price,
        tax,
        category,
        available,
      });
      await product.save();

      res.status(201).json({
        success: true,
        data: product,
        message: "Producto o servicio creado exitosamente",
      });
    } catch (error) {
      console.log(error);
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al crear el producto",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al crear el producto: ${field} ya existe`,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error al crear el producto",
        });
      }
    }
  },

  //Actualizar un producto
  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, //Ejecuta validadores al actualizar
      });
      console.log('Product =>',product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encntrado",
        });
      }
      res.status(200).json({
        success: true,
        data: product,
        message: "Producto actualizado exitosamente",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
          success: false,
          message: "Error al actualizar el producto",
          errors: messages,
        });
      } else if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        res.status(400).json({
          success: false,
          message: `Error al actualizar el producto: ${field} ya existe`,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error al actualizar el producto",
        });
      }
    }
  },

  //Eliminar un producto
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        data: product,
        message: "Producto eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  },

  //Buscar productos
  searchProduct: async (req, res) => {
    try {
      const { name, code, page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      let searchCriteria = {};

      if (name && code) {
        searchCriteria = {
          $or: [
            { name: { $regex: new RegExp(name.toString(), "i") } },
            { code: { $regex: new RegExp(code.toString(), "i") } },
          ],
        };
      } else if (name) {
        searchCriteria.name = { $regex: new RegExp(name.toString(), "i") };
      } else if (code) {
        searchCriteria.code = { $regex: new RegExp(code.toString(), "i") };
      }

      //Buscar el producto que coincida con los criterios de búsqueda
      const products = await Product.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .exec();

      const totalRows = await Product.countDocuments(searchCriteria);

      res.status(200).json({
        success: true,
        data: products,
        meta: {
          total: totalRows,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalRows / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener los productos",
      });
    }
  },
  getProductsByCategory: async (req, res) => {},
};

export default productController;