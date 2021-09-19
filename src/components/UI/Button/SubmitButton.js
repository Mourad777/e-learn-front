import React, { Fragment } from 'react'
import { makeStyles } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    SuccessButton: {
        background: '#4caf50',
        '&:hover': {
            backgroundColor: '#388e3c',
            color: '#FFF'
        }
    },
    ErrorButton: {
        background: '#c62828',
        '&:hover': {
            backgroundColor: '#b71c1c',
            color: '#FFF'
        }
    },
}));

const CustomButton = styled(Button)({
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
});

const SubmitButton = ({ isError, children, clicked,disabled }) => {
    const classes = useStyles();
    return(
    <Fragment>
        <CustomButton disabled={disabled} onClick={clicked} fullWidth className={isError ? classes.ErrorButton : classes.SuccessButton}>
            {children}
        </CustomButton>
    </Fragment>
)}

export default SubmitButton