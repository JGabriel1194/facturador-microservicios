import React from "react";
import { Modal, Button } from "flowbite-react";
import { Client } from "../types/ClientType";

interface DeleteClientModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  client?: Client;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  show,
  onClose,
  onDelete,
  client,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Eliminar Producto</Modal.Header>
      <Modal.Body>
        <p className="dark:text-gray-400">
          ¿Estás seguro de que deseas eliminar el cliente {client?.name}?
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

export default DeleteClientModal;
