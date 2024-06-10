import { Router } from "express";
import fs from 'fs';
import path from 'path';

const router = Router();
const productsFilePath = path.resolve('./src/data/products.json');

function leerProductos() {
    try {
        const data = fs.readFileSync(productsFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error);
        return [];
    }
}

function escribirProductos(products) {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf8");
        console.log("Archivos de productos actualizados correctamente");
    } catch (error) {
        console.error("Error al escribir los archivos de productos:", error);
    }
}

function crearID() {
    const id = Math.floor(10000 + Math.random() * 90000);
    return id.toString().padStart(5, '0');
}

// Método GET para visualizar todos los productos o por ID
router.get('/api/products', (req, res) => {
    let { limit } = req.query;
    limit = parseInt(limit, 10);

    const products = leerProductos();

    if (!isNaN(limit) && limit > 0) {
        res.json({
            message: `Mostrando ${limit} productos`,
            products: products.slice(0, limit)
        });
    } else {
        res.json({
            message: "Mostrando todos los productos",
            products
        });
    }
});

router.get('/api/products/:pid', (req, res) => {
    let { pid } = req.params;
    let productoBuscado = leerProductos().find(producto => producto.id === pid);

    if (productoBuscado) {
        res.json(productoBuscado);
    } else {
        res.status(404).send("El producto buscado no existe");
    }
});

// Método POST para agregar un nuevo producto
router.post('/api/products', (req, res) => {
    const { name, description, code, status, stock, category, image, price } = req.body;

    if (!name || !description || !code || status === undefined || !price || !stock || !category || !thumbnails) {
        return res.status(400).send("Todos los campos son requeridos");
    }

    if (typeof status !== 'boolean') {
        return res.status(400).send("El campo 'status' debe ser un booleano");
    }

    if (!Array.isArray(thumbnails) || !thumbnails.every(t => typeof t === 'string')) {
        return res.status(400).send("El campo 'thumbnails' debe ser un array de strings");
    }

    const nuevoProducto = {
        id: crearID(),
        name,
        description,
        code,
        status,
        stock,
        category,
        image,
        price
    };

    const products = leerProductos();
    products.push(nuevoProducto);
    escribirProductos(products);

    res.status(201).json({
        message: "Producto agregado exitosamente",
        product: nuevoProducto
    });
});

// Método PUT para actualizar un producto por ID
router.put('/api/products/:pid', (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;

    const products = leerProductos();
    const productIndex = products.findIndex(product => product.id === pid);
    if (productIndex === -1) {
        return res.status(404).send("El producto no existe");
    }

    if (updateData.id) {
        delete updateData.id;
    }

    if (updateData.status !== undefined && typeof updateData.status !== 'boolean') {
        return res.status(400).send("El campo 'status' debe ser un booleano");
    }

    if (updateData.thumbnails && (!Array.isArray(updateData.thumbnails) || !updateData.thumbnails.every(t => typeof t === 'string'))) {
        return res.status(400).send("El campo 'thumbnails' debe ser un array de strings");
    }

    const updatedProduct = { ...products[productIndex], ...updateData };
    products[productIndex] = updatedProduct;

    escribirProductos(products);

    res.json({
        message: "Producto actualizado exitosamente",
        product: updatedProduct
    });
});

// Método DELETE para eliminar un producto por ID
router.delete('/api/products/:pid', (req, res) => {
    const { pid } = req.params;

    const products = leerProductos();
    const productIndex = products.findIndex(product => product.id === pid);
    if (productIndex === -1) {
        return res.status(404).send("El producto no existe");
    }

    products.splice(productIndex, 1);

    escribirProductos(products);

    res.json({
        message: "Producto eliminado exitosamente"
    });
});

export default router;