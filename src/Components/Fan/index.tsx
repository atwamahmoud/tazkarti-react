import { useLocation } from "@reach/router";
import React, { FC } from "react";
import { Matches } from "./Matches";
import Tickets from "./Tickets";
import Edit from "./Edit";

export const FanView: FC = () => {
  const { pathname } = useLocation();
  switch (pathname) {
    case "/matches":
      return <Matches />;
    case "/tickets":
      return <Tickets />
    case "/edit":
      return <Edit />
    default:
      return <Matches />;
  }
};

export default FanView;
