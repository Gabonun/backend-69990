import { Router } from "express";
const router = Router();

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
})

//home.handlebars
import ProductManager from "../controllers/product_manager.js";
const productManager = new ProductManager("./src/data/products.json");


router.get("/", async (req, res) => {
    try {
        const productos = await productManager.obtenerProductos()

        res.render("home", {productos});
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

export default router;