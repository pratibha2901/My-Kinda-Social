import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
//redux stuffs
import {connect} from 'react-redux';
import { deleteScream } from '../redux/actions/dataActions';

import MyButton from '../util/MyButton';

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ToolTip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';


//icons Import
import DeleteOutline from '@material-ui/icons/DeleteOutline';

const styles = {
    
    deleteButton: {
       position:'absolute',
        left: '90%',
        top: '10%'
    }
}


class DeleteScream extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({
            open: true
        });
    }
    handleClose = () => {
        this.setState({
            open: false
        });
    };
    handleDeleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.setState({
            open: false
        });
    };
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Scream"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton} >
                    <DeleteOutline color="error" />
                </MyButton>
                <Dialog open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this scream ?
                      </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                          </Button>
                        <Button onClick={this.handleDeleteScream} color="secondary">
                            Delete
                              </Button>
                    </DialogActions>
                </Dialog>

            </Fragment>
        )
    }
}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
};

export default connect(null,{deleteScream })(withStyles(styles)(DeleteScream));
