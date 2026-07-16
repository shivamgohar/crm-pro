import {
  Backdrop,
  CircularProgress,
} from "@mui/material";

function LoadingSpinner({ open }) {

  return (

    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 100,
      }}
    >

      <CircularProgress color="inherit" />

    </Backdrop>

  );

}

export default LoadingSpinner;