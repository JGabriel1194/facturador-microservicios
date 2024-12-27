import React, { useState } from "react";
import { Modal, Button, Label, TextInput, FileInput } from "flowbite-react";

interface SignedModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (file: File, password: string) => void;
}

const SignedModal: React.FC<SignedModalProps> = ({show,onClose,onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSave = () => {
    if (file) {
      onSave(file, password);
      setFile(null);
      setPassword("");
      onClose();
    }
  }

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>
          <h2>Cargar firma electrónica</h2>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-3">
              <Label htmlFor="formFile" value="Archivo de firma digital" />
              <FileInput id="formFile" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <Label htmlFor="formPassword" value="Contraseña" />
              <TextInput
                id="formPassword"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Enviar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignedModal;
