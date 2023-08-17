import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';


const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  const [t, i18n] = useTranslation('global');


  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
        {t('patient.addModal.button.cancel')}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
        {t('patient.addModal.button.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;