
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationDialog = ({
  show,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "Cancel"
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
