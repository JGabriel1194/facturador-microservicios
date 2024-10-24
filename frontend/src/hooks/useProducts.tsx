import { useState, useEffect, useCallback } from "react";
import { Product } from "../types/ProductType";
import { Pagination } from "../types/PaginationInterface";

const useProducts = (page: number, limit: number, searchQuery: string) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null >(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const baseUrl = "http://localhost:3002/api/products";

  const fetchProducts = useCallback(async () => {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    
    if (searchQuery) {
      url = `${baseUrl}/search?name=${encodeURIComponent(searchQuery)}&code=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError({
          success: false,
          message: "Error al cargar los productos",
          errors: ["Error desconocido"],
        });
      }
      const data = await response.json();
      
      if (Array.isArray(data.data)) {
        setProducts(data.data);
        setPagination(data.meta);
      } else {
        setError({
          success: false,
          message: "Error al cargar los productos",
          errors: [
            "La respuesta de la API no contiene un array en la propiedad 'data'",
          ],
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log('Error ==>>', err)
         setError({
           success: false,
           message: "Error al cargar los productos",
           errors: ["Error desconocido"],
         });
      } else {
        setError({
          success: false,
          message: "Error al cargar los productos",
          errors: ["Error desconocido"],
        });
      }
    } finally {
      setLoading(false);
    }
  }, [baseUrl, page, limit, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProduct = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const url = product._id ? `${baseUrl}/${product._id}` : baseUrl;
      const response = await fetch(url, {
        method: product._id ? "PUT" : "POST", // Usar PUT para editar y POST para crear
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const savedProduct = await response.json();
      if (!response.ok) {
        setError(savedProduct);
        return
      }

      fetchProducts(); // Volver a cargar los productos después de guardar
      return savedProduct;
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError({
          success: false,
          message: "2 - Error al actualizar el producto",
          errors: ["Error desconocido"],
        });
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  },[]);

  const deleteProduct = async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${product._id}`, {
        method: "DELETE",
      });

      const deletedProduct = await response.json();
      if (!response.ok) {
        setError(deletedProduct);
        return;
      }

      fetchProducts(); // Volver a cargar los productos después de eliminar
      return deletedProduct;
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError({
          success: false,
          message: "Error al eliminar el producto",
          errors: ["Error desconocido"],
        });
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    pagination,
    loading,
    error,
    saveProduct,
    deleteProduct
  };
};

export default useProducts ;
