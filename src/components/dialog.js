import { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

class ConfirmationModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { modalKey, confirmModalState } = nextProps

    if (confirmModalState && (modalKey === confirmModalState.modalKey)) {
      return { open: confirmModalState.openModal }
    }

    return { open: false }
  }

  handleCancel = () => {
    const { actions, modalKey } = this.props
    actions.ui.closeConfirmModal({ modalKey })
  }

  handleOk = () => {
    const { actions, modalKey, okCallback } = this.props
    if (okCallback) { okCallback() }
    actions.ui.closeConfirmModal({ modalKey })
  }

  render() {
    const {
      children,
      okCallback,
      modalKey,
      confirmModalState,
      title,
      ...other
    } = this.props
    const { open } = this.state

    return (
      <Dialog
        onClose={this.handleCancel}
        open={open}
        maxWidth={false}
        aria-labelledby="confirmation-dialog-title"
        title={title}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={this.handleCancel}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={this.handleOk}
            variant="text"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmationModal.propTypes = {
  actions: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
  okCallback: PropTypes.func,
  modalKey: PropTypes.string.isRequired,
  confirmModalState: PropTypes.shape({}).isRequired,
  title: PropTypes.string
}

ConfirmationModal.defaultProps = {
  children: null,
  okCallback: null,
  title: ''
}

export default ConfirmationModal
