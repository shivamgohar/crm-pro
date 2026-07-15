import { Snackbar, Alert } from "@mui/material";

function CustomSnackbar({

    open,

    message,

    severity,

    onClose,

}) {

    return (

        <Snackbar

            open={open}

            autoHideDuration={4000}

            onClose={onClose}

            anchorOrigin={{

                vertical: "bottom",

                horizontal: "right",

            }}

        >

            <Alert

                severity={severity}

                onClose={onClose}

                variant="filled"

                sx={{

                    width: "100%",

                }}

            >

                {message}

            </Alert>

        </Snackbar>

    );

}

export default CustomSnackbar;