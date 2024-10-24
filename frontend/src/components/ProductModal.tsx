import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import {Product} from "../types/ProductType";
interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onClose,
  onSave,
  product,
}) => {
  const [formData, setFormData] = useState<Product>({
    _id: "",
    code: "",
    name: "",
    description: "",
    price: 0,
    tax: 0,
    available: true,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "available" ? e.target.checked : value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        {product ? "Editar Producto" : "Nuevo Producto"}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="code" value="Código" />
            <TextInput
              id="code"
              name="code"
              value={formData.code}
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
            <Label htmlFor="description" value="Descripción" />
            <TextInput
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price" value="Precio" />
            <TextInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="tax" value="Impuesto" />
            <TextInput
              id="tax"
              name="tax"
              type="number"
              value={formData.tax}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="available" value="Disponible" />
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
              className="ml-2"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>
          {product ? "Guardar Cambios" : "Agregar Producto"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
