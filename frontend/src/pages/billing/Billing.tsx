import { useEffect, useState } from "react";
import useBillings from "../../hooks/useBillins";
import { Alert, Dropdown, Pagination } from "flowbite-react";
import DropdownLimit from "../../components/DropdownLimit";
import SearchBar from "../../components/SearchBar";
import ProductModal from "../../components/ProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";
import debounce from "../../utils/debounce";
import CountItems from "../../components/CountItems";
import { Navigate, useNavigate } from "react-router-dom";

const Billing = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState<any | null>(null);
  const navigate = useNavigate();

  const { invoices, pagination, loading, error, saveBilling, deleteBilling, dowloadXML } =
    useBillings(page, limit, debouncedQuery);

    console.log('billings ==>>', invoices)
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  const handleSelect = (value: number) => {
    setPage(1);
    setLimit(value);
  };

  const handleGoNew = () => {
    navigate("/billing/invoice");
  }

  const handleDownloadXML = (_id: string, claveAcceso:string) => {
    dowloadXML(_id,claveAcceso);
  }
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
          <h3 className="text-2xl font-bold dark:text-white">Productos</h3>
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
              onClick={handleGoNew}
            >
              Nueva factura
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="relative mb-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="text-m bg-gray-50 uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Fecha de emisión
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Tipo de comprobante
              </th> */}
              <th scope="col" className="px-6 py-3">
                Número de comprobante
              </th>
              <th scope="col" className="px-6 py-3">
                Identificación
              </th>
              <th scope="col" className="px-6 py-3">
                Reson social
              </th>
              <th scope="col" className="px-6 py-3">
                Clave de acceso
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
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invoice.invoice.infoFactura.fechaEmision}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invoice.invoice.infoTributaria.secuencial}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invoice.invoice.infoFactura.identificacionComprador}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invoice.invoice.infoFactura.razonSocialComprador}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invoice.invoice.infoTributaria.claveAcceso}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Dropdown label="Acciones">
                      <Dropdown.Item
                        onClick={() => {
                          handleDownloadXML(invoice._id, invoice.invoice.infoTributaria.claveAcceso);
                        }}
                      >
                        XML
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          // setProductToDelete(product);
                          // setShowDeleteModal(true);
                        }}
                      >
                        RIDE
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          // setProductToDelete(product);
                          // setShowDeleteModal(true);
                        }}
                      >
                        Anular
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          // setProductToDelete(product);
                          // setShowDeleteModal(true);
                        }}
                      >
                        Enviar por correo
                      </Dropdown.Item>
                    </Dropdown>
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
      {/* <ProductModal
        show={showModal}
        product={currentProduct}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
      /> */}
      {/* Delete Modal */}
      {
        // <DeleteProductModal
        //   show={showDeleteModal}
        //   onClose={handleCloseDeleteModal}
        //   onDelete={handleDeleteProduct}
        //   product={productToDelete}
        // />
      }
    </div>
  );
};

export default Billing;
