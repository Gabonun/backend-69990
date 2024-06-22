import express from "express";
const router = express.Router();

import ProductManager from "../controllers/product_manager.js";;
const productManager = new ProductManager("./src/data/products.json");

//Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.obtenerProductos();

        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error("Error el obtener los productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Traer solo un producto x ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.obtenerProductoxID(parseint(id));
        if (!producto){
            return res.json({ error: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener el producto", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
});

//Agregar nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.agregarProducto(nuevoProducto);
        res.status(201).json({ message: "Producto Agregado" });
    } catch (error) {
        console.error("Error al agregar un producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Actualizar x ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const actualizado = req.body;

    try {
        await productManager.actualizarProducto(parseint(id), actualizado);
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Eliminar producto x ID
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.eliminarProducto(parseint(id));
        res.json({ message: "Producto eliminado exitosamente"});
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;