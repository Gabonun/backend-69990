import { promises as fs} from 'fs';

class ProductManager {
    static ultID = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async agregarProducto({name, description, code, stock, category, image, price}) {
        try {
            const arrayProductos = await this.leerArchivo();

            if (!name || !description || !code || !stock || !category || !price) {
                //console.log(name, description, code, stock, category, image, price)
                console.log("Todos los campos son obligatorios");
                return;
            }

            const nuevoProducto = {
                name,
                description,
                code,
                status: true,
                stock,
                category,
                image,
                price
            };

            if (arrayProductos.length > 0) {
                ProductManager.ultID = arrayProductos.reduce((maxID, product) => Math.max(maxID, product.id), 0);
            }

            nuevoProducto.id = ++ProductManager.ultID;

            arrayProductos.push(nuevoProducto);
            await this.guardarArchivo(arrayProductos);
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

    async obtenerProductos() {
        try {
            const arrayProductos = await this.leerArchivo();
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async obtenerProductoxID(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const prodID = arrayProductos.find(item => item.id === id);

            if (!prodID) {
                console.log("Producto no encontrado");
                return null;
            } else {
                return prodID;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }

    async actualizarProducto(id, producto) {
        try {
            const arrayProductos = await this.leerArchivo();
            const indice = arrayProductos.findIndex(item => item.id === id);

            if (indice !== -1) {
                arrayProductos[indice] = {...arrayProductos[indice], ...producto };
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async eliminarProducto(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const indice = arrayProductos.findIndex(item => item.id === id);

            if (indice !== -1) {
                arrayProductos.splice(indice, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto Eliminado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;