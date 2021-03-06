import { AppBar, Box, Typography, Button, Grid } from "@material-ui/core";
import { Link } from "@reach/router";
import React, { FC } from "react";



const EmptyTopBar: FC = () => (
    <AppBar>
        <Box p={2}>
            <Grid container spacing={2} justify="space-between" alignItems="center">
                <Grid item xs="auto">
                    <Box flexGrow={1}>
                        <Typography variant="h4">Tazkarti</Typography>
                    </Box>
                </Grid>
                <Grid item xs="auto">
                    <Button color="inherit" variant="text">
                        <Link to="/logout">Logout</Link>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </AppBar>
)

export default EmptyTopBar;