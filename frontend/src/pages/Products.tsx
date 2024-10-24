import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import DropdownLimit from "../components/DropdownLimit";
import SearchBar from "../components/SearchBar";
import CountItems from "../components/CountItems";
import { Pagination, Alert } from "flowbite-react";
import debounce from "../utils/debounce";
import { Product } from "../types/ProductType";
import ProductModal from "../components/ProductModal";
import DeleteProductModal from "../components/DeleteProductModal";

const Products = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState<any | null >(null)

  const {
    products,
    pagination,
    loading,
    error,
    saveProduct,
    deleteProduct,
  } = useProducts(page, limit, debouncedQuery);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    if(error !== null) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      },5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if(successMessage){
      const timer = setTimeout(() => {
        setShowAlert(false);
      },1000);
      return () => clearTimeout(timer)
    }
  },[successMessage])

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

  const handleOpenModal = (product?: Product) => {
    setCurrentProduct(product || ({} as Product));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct({} as Product);
  };

  const handleSaveProduct = async (product: Product) => {
    const savedProduct = await saveProduct(product);
    if (savedProduct) {
      handleCloseModal();
      setSuccessMessage(savedProduct)
      setShowAlert(true)
    }
  };

  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete({} as Product);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      const deletedProduct = await deleteProduct(productToDelete);
      if (deletedProduct) {
        handleCloseDeleteModal();
        setSuccessMessage(deletedProduct);
        setShowAlert(true)
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
              onClick={() => handleOpenModal()}
            >
              Nuevo producto
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
                Código
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Impuesto
              </th>
              <th scope="col" className="px-6 py-3">
                Disponible
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
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.code}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.price}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.tax}%
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {product.available ? "Sí" : "No"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      onClick={() => handleOpenModal(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      onClick={() => handleOpenDeleteModal(product)}
                    >
                      Eliminar
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
      <ProductModal
        show={showModal}
        product={currentProduct}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
      />
      {/* Delete Modal */}
      {
        <DeleteProductModal
          show={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteProduct}
          product={productToDelete}
        />
      }
    </div>
  );
};

export default Products;
