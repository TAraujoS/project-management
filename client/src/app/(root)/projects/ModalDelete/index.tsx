import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

type ModalDeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  name: string;
  isProject?: boolean;
};

const ModalDelete = ({
  isOpen,
  onClose,
  name,
  onDelete,
  isProject = true,
}: ModalDeleteProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" fontWeight="bold">
        {name}
      </DialogTitle>
      <DialogContent>
        {isProject ? (
          <>
            <DialogContentText
              id="alert-dialog-description"
              color="textPrimary"
            >
              Tem certeza que deseja excluir este projeto?
            </DialogContentText>
            <DialogContentText
              id="alert-dialog-description"
              color="textPrimary"
            >
              Todas as tarefas desse projeto também serão excluídas.
            </DialogContentText>
          </>
        ) : (
          <DialogContentText id="alert-dialog-description" color="textPrimary">
            Tem certeza que deseja excluir esta tarefa?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onDelete} autoFocus color="warning">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
