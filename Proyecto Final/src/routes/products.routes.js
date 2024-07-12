import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
const router = express.Router();
const productManager = new ProductManager();

//Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const {limit = 5, page = 1, sort, query} = req.query;

        const productos = await productManager.obtenerProductos({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        console.error("Error el obtener los productos", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
    }
});

//Traer solo un producto x ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.obtenerProductoxID(id);
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
        await productManager.actualizarProducto(id, actualizado);
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
        await productManager.eliminarProducto(id);
        res.json({ message: "Producto eliminado exitosamente"});
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;