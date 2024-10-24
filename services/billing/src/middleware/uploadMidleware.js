import multer from "multer";
import path from "path";
import fs from "fs";

// Verificar y crear el directorio temporal si no existe
const tempDir = "./uploads/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configuración del almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Carpeta temporal donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});

// Filtro de archivos para asegurarse de que solo se suban archivos .p12
const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  if (fileExtension === ".p12") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos .p12"), false);
  }
};

// Middleware de Multer
const upload = multer({ storage, fileFilter }).single("p12File");

// Middleware para manejar la carga y retornar la ruta del archivo
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }
    // Retornar la ruta del archivo
    req.filePath = path.join(tempDir, req.file.filename);
    next();
  });
};

export default uploadMiddleware;
