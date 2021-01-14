import { Redirect, RouteComponentProps } from "@reach/router";
import React, { FC } from "react";
import { logout } from "../../Services/Auth";

const Logout: FC<RouteComponentProps> = () => {
    logout();
    return <Redirect to="/login" noThrow={true} />
} 

export default Logout;