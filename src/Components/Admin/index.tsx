import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { IUser } from "../../Interfaces/User";
import { deleteUser, getUsers, toggleValidation } from "../../Services/Admin";

export const AdminView: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  function getDeleteHandler(user: IUser): () => Promise<void> {
    return async () => {
      const errors = await deleteUser(user.id);
      if (!errors.length) {
        setUsers(users.filter(({ id }) => id !== user.id));
      }
    };
  }
  function getToggleValidHandler(user: IUser): () => Promise<void> {
    return async () => {
      const errors = await toggleValidation(user.id);
      if (!errors.length) {
        setUsers(
          users.map((_user) => {
            if (_user.id === user.id) {
              return {
                ...user,
                isValid: !user.isValid,
              };
            }
            return _user;
          })
        );
      }
    };
  }

  return (
    <>
      {users.map((user) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            {user.isValid ? "Valid" : "Invalid"} | {user.role} |{" "}
            {user.firstName}-{user.lastName}
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center" justify="center">
              <Grid item xs="auto">
                <Button variant="outlined" color="primary" onClick={getToggleValidHandler(user)}>
                  {user.isValid ? "Invalidate" : "Validate"}
                </Button>
              </Grid>
              <Grid item xs="auto">
                <Button onClick={getDeleteHandler(user)} variant="outlined" color="primary">
                  Delete
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default AdminView;
