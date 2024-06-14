import React from 'react';
import Modal from 'react-modal';

const eModal = ({ isOpen, onClose, errors,title }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Mensaje de Error"
    >
      <h2>Mensaje de Error</h2>
      <button onClick={onClose}>Cerrar</button>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>
            <strong>Tipo:</strong> {error.type}<br />
            <strong>Valor:</strong> {error.value}<br />
            <strong>Mensaje:</strong> {error.msg}<br />
            <strong>Ubicación:</strong> {error.location}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default eModal;
