import express from "express";
import CartManager from "../controllers/cart_manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/data/cart.json");

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartID = parseInt(req.params.cid);
    try {
        const carrito = await cartManager.obtenerCarritoxId(cartID);
        res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartID = parseint(req.params.cid);
    const productID = req.params.pid;
    const cantidad = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProducto(cartID, productID, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;