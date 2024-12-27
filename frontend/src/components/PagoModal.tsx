import { useEffect, useState } from "react";
import { PagoType } from "../types/PagoType";
import { Button, Label, Modal, TextInput } from "flowbite-react";

interface PagoModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (pago: PagoType) => void;
  pago?: PagoType;
}

const PagoModal: React.FC<PagoModalProps> = ({ show, onClose, onSave, pago }) => {
    
    const [formaPago, setFormaPago] = useState<PagoType>({
      formaPago: "",
      total: 0,
      plazo: 0,
      unidadTiempo: "",
    });

    useEffect(() => {
        if (pago) {
            setFormaPago(pago);
        }
    }
    , [pago]);


const handleSubmit = () => {
    onSave(formaPago);
    onClose();
};

    return (
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Seleccionar Método de Pago</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formaPago" value="Forma de Pago" />
              <TextInput
                id="formaPago"
                type="text"
                placeholder="Forma de Pago"
                value={formaPago.formaPago}
                onChange={(e) =>
                  setFormaPago({ ...formaPago, formaPago: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="valor" value="Valor" />
              <TextInput
                id="valor"
                type="number"
                placeholder="Valor"
                value={formaPago.total}
                onChange={(e) =>
                  setFormaPago({
                    ...formaPago,
                    total: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="plazo" value="Plazo" />
              <TextInput
                id="plazo"
                type="text"
                placeholder="Plazo"
                value={formaPago.plazo}
                onChange={(e) =>
                  setFormaPago({
                    ...formaPago,
                    plazo: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="tiempo" value="Tiempo" />
              <TextInput
                id="tiempo"
                type="text"
                placeholder="Tiempo"
                value={formaPago.unidadTiempo}
                onChange={(e) =>
                  setFormaPago({
                    ...formaPago,
                    unidadTiempo: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleSubmit()}>
            Agregar
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default PagoModal;
