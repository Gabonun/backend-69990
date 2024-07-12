import mongoose from "mongoose";

mongoose.connect("mongodb+srv://gabrielnez:Gabo1942@cluster0.qzr7vos.mongodb.net/coderCommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión Exitosa"))
    .catch(() => console.log("Error en la Conexión"))