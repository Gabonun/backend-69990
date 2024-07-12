import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

//POST -> CREAR CARRITO
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//GET -> LISTAR TODOS LOS CARRITOS
router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.obtenerCarritos();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al listar los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//GET --> LISTAR PRODUCTOS DEL CARRITO x ID
router.get("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    try {
        const carrito = await cartManager.obtenerCarritoxID(cartID);
        
        if (!carrito){
            console.log("No existe el carrito");
            return res.status(404).json({error: "Carrito no encontrado"});
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//POST --> AGREGAR PRODUCTOS AL CARRITO
router.post("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const cantidad = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoCarrito(cartID, productID, cantidad);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//DELETE --> ELIMINAR CARRITO POR ID (VACIAR CARRITO)
router.delete("/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const carrito = await cartManager.vaciarCarrito(cartID);
        res.json({status: 'success', message: 'Se eliminaron todos los productos del carrito', carrito});
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//PUT --> ACTUALIZAR CARRITO POR ID
router.put("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    const productoUPD = req.body;

    try {
        const carritoUPD = await cartManager.actualizarCarrito(cartID, productoUPD);
        res.json(carritoUPD);
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//DELETE --> ELIMINAR UN PRODUCTO POR ID
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const carritoUPD = await cartManager.eliminarProductoCarrito(cartID, productID);

        res.json({status: 'success', message: 'Producto eliminado correctamente', carritoUPD});
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//PUT --> ACTUALIZAR CANTIDAD DE PRODUCTO EN CARRITO
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.oid;
        const cantidad = req.body.quantity;

        const carrito = await cartManager.actualizarCantidadProductoCarrito(cartID, productID, cantidad);

        res.json({status: 'success', message: 'Cantidad actualizada correctamente', carrito});
    } catch (error) {
        console.error("Error al actualizar el producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

export default router;