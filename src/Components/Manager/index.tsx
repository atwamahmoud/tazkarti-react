import { useLocation } from "@reach/router";
import React, { FC } from "react";
import CreateMatch from "./CreateMatch";
import CreateStadium from "./CreateStadium";
import EditMatch from "./EditMatch";
import { Matches } from "./Matches";

export const ManagerView: FC = () => {
  const { pathname } = useLocation();
  const regex = /\/match\/.+/;
  if (regex.test(pathname))
    return (
      <EditMatch matchId={pathname.replace("match", "").replace(/\//g, "")} />
    );
  switch (pathname) {
    case "/matches":
      return <Matches />;
    case "/create-match":
      return <CreateMatch />;
    case "/stadium-create":
      return <CreateStadium />;
    default:
      return <Matches />;
  }
};

export default ManagerView;
