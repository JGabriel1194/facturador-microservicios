import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { Client } from "../types/ClientType";
interface ClientModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client?: Client;
}

const ClientModal: React.FC<ClientModalProps> = ({
  show,
  onClose,
  onSave,
  client,
}) => {
  const [formData, setFormData] = useState<Client>({
    _id: "",
    name: "",
    ciType: 1,
    ci: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value, type } = e.target;
     setFormData((prevData) => ({
       ...prevData,
       [name]: type === "radio" ? parseInt(value, 10) : value,
     }));
   };

  const handleSubmit = () => {
    console.log('Form data',formData);
    onSave(formData);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{client ? "Editar Cliente" : "Nuevo Cliente"}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="ciType" value="Tipo" />
            <div className="ml-2 flex space-x-4">
              <div className="flex items-center">
                <input
                  id="ciType-cedula"
                  name="ciType"
                  type="radio"
                  value={1}
                  checked={formData.ciType === 1}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="ciType-cedula"
                  className="text-gray-900 dark:text-gray-300"
                >
                  Cédula
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="ciType-ruc"
                  name="ciType"
                  type="radio"
                  value={2}
                  checked={formData.ciType === 2}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="ciType-ruc"
                  className="text-gray-900 dark:text-gray-300"
                >
                  RUC
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="ciType-pasaporte"
                  name="ciType"
                  type="radio"
                  value={3}
                  checked={formData.ciType === 3}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="ciType-pasaporte"
                  className="text-gray-900 dark:text-gray-300"
                >
                  Pasaporte
                </label>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="ci" value="Cédula" />
            <TextInput
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="name" value="Nombre" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" value="Teléfono" />
            <TextInput
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address" value="Dirección" />
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>
          {client ? "Guardar Cambios" : "Agregar Producto"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClientModal;
