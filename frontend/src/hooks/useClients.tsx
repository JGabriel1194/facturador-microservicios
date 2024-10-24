import { useState, useEffect, useCallback } from "react";
import { Client } from "../types/ClientType";
import { Pagination } from "../types/PaginationInterface";

const useClient = (page: number, limit: number, searchQuery: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const baseUrl = "http://localhost:3001/api/clients";

  const fetchClients = useCallback(async () => {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;

    if (searchQuery) {
      url = `${baseUrl}/search?name=${encodeURIComponent(searchQuery)}&ci=${encodeURIComponent(searchQuery)}&email=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError({
          success: false,
          message: "Error al cargar los clientes",
          errors: ["Error desconocido"],
        });
      }
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setClients(data.data);
        setPagination(data.meta);
      } else {
        setError({
          success: false,
          message: "Error al cargar los clientes",
          errors: [
            "La respuesta de la API no contiene un array en la propiedad 'data'",
          ],
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError({
          success: false,
          message: "Error al cargar los clientes",
          errors: ["Error desconocido"],
        });
      }
    } finally {
      setLoading(false);
    }
  }, [baseUrl, page, limit, searchQuery]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const saveClient = useCallback(async (client: Client) => {
    setLoading(true);
    setError(null);
    try {
      const url = client._id ? `${baseUrl}/${client._id}` : baseUrl;
      const response = await fetch(url, {
        method: client._id ? "PUT" : "POST", // Usar PUT para editar y POST para crear
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });
      const savedClient = await response.json();
      if (!response.ok) {
        setError(savedClient);
        return;
      }

      fetchClients(); // Volver a cargar los clientes después de guardar
      return savedClient;
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError({
          success: false,
          message: "2 - Error al actualizar el cliente",
          errors: ["Error desconocido"],
        });
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClient = async (client: Client) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${client._id}`, {
        method: "DELETE",
      });

      const deletedClient = await response.json();
      if (!response.ok) {
        setError(deletedClient);
        return;
      }

      fetchClients(); // Volver a cargar los clientes después de eliminar
      return deletedClient;
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError({
          success: false,
          message: "Error al eliminar el cliente",
          errors: ["Error desconocido"],
        });
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    pagination,
    loading,
    error,
    saveClient,
    deleteClient,
  };
};

export default useClient;
