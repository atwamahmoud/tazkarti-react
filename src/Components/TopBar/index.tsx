import React, { FC } from "react";
import AdminTopBar from "./AdminTopBar";
import DefaultTopBar from "./DefaultTopBar";
import EmptyTopBar from "./EmptyTopBar";
import FanTopBar from "./FanTopBar";
import GuestTopBar from "./GuestTopBar"
import ManagerTopBar from "./ManagerTopBar";

type TopBarProps = {
    isAuth: boolean;
    role?: "Fan"|"Manager"|"Admin";
    isValid: boolean;
}

const TopBar: FC<TopBarProps> = ({isAuth, role, isValid}) => {
    if(!isAuth) return <GuestTopBar />
    if(!isValid) return <EmptyTopBar />
    if(role === "Fan") return <FanTopBar />
    if(role === "Manager") return <ManagerTopBar />
    if(role === "Admin") return <AdminTopBar />
    return <DefaultTopBar />
}

export default TopBar;