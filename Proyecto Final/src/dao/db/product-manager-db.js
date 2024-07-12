import ProductModel from "../../models/product.model.js";

class ProductManager {

    async agregarProducto({name, description, code, stock, category, image, price}) {
        try {

            if (!name || !description || !code || !stock || !category || !price) {
                //console.log(name, description, code, stock, category, image, price)
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code});

            if (existeProducto){
                console.log("El código debe ser único");
                return;
            }

            const nuevoProducto = new ProductModel({
                name,
                description,
                code,
                status: true,
                stock,
                category,
                image,
                price
            });

            await nuevoProducto.save();
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

    //aplicamos limite, pagina, query y ordenamiento
    async obtenerProductos({limit = 5, page = 1, sort, query} = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query){
                queryOptions = {category: query};
            }

            const ordenOpt = {};
            if (sort){
                if (sort === 'asc' || sort === 'desc'){
                    ordenOpt.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(ordenOpt)
                .skip(skip)
                .limit(limit);

            const totalProductos = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProductos / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1: null,
                nextPage: hasNextPage ? page + 1: null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async obtenerProductoxID(id) {
        try {
            const producto = await ProductModel.findById(id);

            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            }
            return producto;
        } catch (error) {
            console.log("Error al obtener el producto por ID", error);
            throw error;
        }
    }

    async actualizarProducto(id, producto) {
        try {
            const actualiza = await ProductModel.findByIdAndUpdate(id, producto);

            if (!actualiza) {
                console.log("No se encuentra el producto");
                return null;
            }

            console.log("Producto actualizado exitosamente");
            return actualiza
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async eliminarProducto(id) {
        try {
            const elimina = await ProductModel.findByIdAndDelete(id);

            if (!elimina) {;
                console.log("El producto a eliminar no fue encontrado");
                return null;
            }

            console.log("Producto Eliminado")
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;