import { Box, Grid, Typography } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import React, { FC } from "react";
import FanView from "../../Components/Fan";
import ManagerView from "../../Components/Manager";
import GuestView from "../../Components/Guest";
import TopBar from "../../Components/TopBar";
import { getUser, isAuth } from "../../Services/Auth";
import AdminView from "../../Components/Admin";


const NotValidUser = (
    <Grid container spacing={2} justify="center">
        <Grid item xs="auto">
            <Box p={4} paddingTop={25}>
                <Typography variant="body1">You're not a valid user yet please wait for your validation</Typography>
            </Box>
        </Grid>
    </Grid>
)

export const Home: FC<RouteComponentProps> = () => {
    const user = getUser();
    function renderMainContent(): JSX.Element {
        if(!user) return <GuestView />
        if(!user?.isValid) {
            return NotValidUser;
        }
        switch (user.role) {
            case "Manager":
                return <ManagerView />
            case "Fan":
                return <FanView />
            default:
                return <AdminView />
        }
    }
    return (
        <>
            <TopBar isValid={user?.isValid} isAuth={isAuth()} role={user?.role} />
            {renderMainContent()}
        </>
    )
}