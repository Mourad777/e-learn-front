import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import SubmitButton from "../../../../components/UI/Button/SubmitButton"
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import React from 'react'

export const getButtons = (
    page, 
    formPages, 
    topPlacement, 
    editing, 
    isError, 
    t, 
    previousPage, 
    nextPage, 
    resetFormValidity, 
    checkPageValidity, 
    isBlockedByStudent, 
    onSubmit
    ) => {
    const buttons = (
        <Aux>
            <div
                style={{ display: 'flex', justifyContent: page === 1 ? 'flex-end' : 'space-between' }}
            >
                {page !== 1 && (
                    <Button
                        color="primary"
                        onClick={() => {
                            previousPage();
                            resetFormValidity();
                        }}
                        startIcon={<ArrowBackIosIcon />}
                    >
                        {""}
                    </Button>
                )}
                {!(formPages === page) && (
                    <Button
                        color={!isError ? "primary" : "secondary"}
                        onClick={() => {
                            const valid = checkPageValidity(page);
                            if (!valid) return;
                            nextPage();
                            resetFormValidity();
                        }}
                        startIcon={<ArrowForwardIosIcon />}
                    >
                        {""}
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                {formPages === page && !topPlacement && (
                    <SubmitButton
                        fullWidth
                        isError={!(!isError && !isBlockedByStudent)}
                        clicked={onSubmit}
                    >
                        {editing ? t("testForm.buttons.update") : t("testForm.buttons.publish")}
                    </SubmitButton>
                )}
            </div>
        </Aux>
    );
    return buttons;
};