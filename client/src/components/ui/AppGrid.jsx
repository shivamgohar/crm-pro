import { Grid } from "@mui/material";

export default function AppGrid(props) {
    return (
        <Grid
            container
            spacing={3}
            {...props}
        />
    );
}