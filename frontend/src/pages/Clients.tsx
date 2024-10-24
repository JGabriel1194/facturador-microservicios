import { useEffect, useState } from "react";
import useClients from "../hooks/useClients";
import DropdownLimit from "../components/DropdownLimit";
import SearchBar from "../components/SearchBar";
import CountItems from "../components/CountItems";
import { Pagination, Alert } from "flowbite-react";
import debounce from "../utils/debounce";
import { Client } from "../types/ClientType";
import ClientModal from "../components/ClientModal";
import DeleteClientModal from "../components/DeleteClientModal";

const ciTypeMapping = {
  1: "Cédula",
  2: "RUC",
  3: "Pasaporte",
};

const Clients = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(
    undefined,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | undefined>(
    undefined,
  );
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState<any | null>(null);

  const { clients, pagination, loading, error, saveClient, deleteClient } =
    useClients(page, limit, debouncedQuery);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    if (error !== null) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const debouncedSearch = debounce((query) => {
      setDebouncedQuery(query);
    }, 5000);
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleSelect = (value: number) => {
    setPage(1);
    setLimit(value);
  };

  const handleOpenModal = (client?: Client) => {
    setCurrentClient(client || ({} as Client));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentClient({} as Client);
  };

  const handleSaveClient = async (client: Client) => {
    const savedClient = await saveClient(client);
    if (savedClient) {
      handleCloseModal();
      setSuccessMessage(savedClient);
      setShowAlert(true);
    }
  };

  const handleOpenDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClientToDelete({} as Client);
  };

  const handleDeleteProduct = async () => {
    if (clientToDelete) {
      const deletedProduct = await deleteClient(clientToDelete);
      if (deletedProduct) {
        handleCloseDeleteModal();
        setSuccessMessage(deletedProduct);
        setShowAlert(true);
      }
    }
  };

  return (
    <div>
      <div className="">
        {showAlert && (
          <div className="absolute right-4 z-50">
            <Alert
              color={error ? "failure" : "success"}
              onDismiss={() => setShowAlert(false)}
            >
              <div>
                {error ? (
                  <strong>{error?.message}</strong>
                ) : (
                  <strong>{successMessage?.message}</strong>
                )}
              </div>
              <div>{error?.errors?.join(", ")}</div>
            </Alert>
          </div>
        )}
      </div>
      {/* Header */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="col-span-4 flex items-center">
          <h3 className="text-2xl font-bold dark:text-white">Clientes</h3>
        </div>
        <div className="col-span-8 flex h-14 justify-end rounded">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-light dark:text-white">Mostrar</h3>
            <DropdownLimit limit={limit} onSelect={handleSelect} />
          </div>
          <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => handleOpenModal()}
            >
              Nuevo cliente
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="relative mb-4 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="text-m bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Documento
              </th>
              <th scope="col" className="px-6 py-3">
                Número
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Teléfono
              </th>
              <th scope="col" className="px-6 py-3">
                Dirección
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  Cargando productos...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {ciTypeMapping[client.ciType as keyof typeof ciTypeMapping]}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{client.ci}</td>
                  <td className="whitespace-nowrap px-6 py-4">{client.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {client.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {client.phone}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {client.address}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      onClick={() => handleOpenModal(client)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 12v4h4v-1H5v-3H4z" />
                      </svg>
                    </button>
                    <button
                      className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      onClick={() => handleOpenDeleteModal(client)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3a1 1 0 00-1 1v1H4a1 1 0 100 2h16a1 1 0 100-2h-4V4a1 1 0 00-1-1H9zM5 9a1 1 0 011 1v9a2 2 0 002 2h8a2 2 0 002-2V10a1 1 0 112 0v9a4 4 0 01-4 4H8a4 4 0 01-4-4V10a1 1 0 011-1zm3 0a1 1 0 011 1v9a1 1 0 11-2 0V10a1 1 0 011-1zm6 0a1 1 0 011 1v9a1 1 0 11-2 0V10a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <nav
          className="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row"
          aria-label="Table navigation"
        >
          {pagination && <CountItems pagination={pagination} />}
          <Pagination
            currentPage={page}
            totalPages={pagination?.totalPages ?? 0}
            onPageChange={setPage}
            nextLabel="Siguiente"
            previousLabel="Anterior"
          />
        </nav>
      </div>
      {/* Modal */}
      <ClientModal
        show={showModal}
        client={currentClient}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
      />
      {/* Delete Modal */}
      {
        <DeleteClientModal
          show={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteProduct}
          client={clientToDelete}
        />
      }
    </div>
  );
};

export default Clients;
