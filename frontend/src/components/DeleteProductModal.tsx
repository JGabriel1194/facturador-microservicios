import React from "react";
import { Modal, Button } from "flowbite-react";
import { Product } from "../types/ProductType";

interface DeleteWarningModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  product?: Product;
}

const DeleteProductModal: React.FC<DeleteWarningModalProps> = ({
  show,
  onClose,
  onDelete,
  product,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Eliminar Producto</Modal.Header>
      <Modal.Body>
        <p className="dark:text-gray-400">
          ¿Estás seguro de que deseas eliminar el producto {product?.name}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="red" onClick={onDelete}>
          Eliminar
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;
