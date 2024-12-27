import { Modal, Spinner } from 'flowbite-react';
import React from 'react';

interface LoadModalProps {
    show: boolean;
}

const LoadModal: React.FC<LoadModalProps> = ({ show }) => {
    if (!show) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }}
      >
        <Spinner role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
};

export default LoadModal;