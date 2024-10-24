import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB - Products")
    } catch (error) {
        console.log("Error al conectar a MongoDB - Products",error)
        process.exit(1); //Termina el proceso si no se puede conectar
    }
}

export default connectDB;