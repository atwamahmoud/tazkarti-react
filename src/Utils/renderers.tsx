import { Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";

export function renderErrors(errors: string[]) {
  return errors.map((err) => (
    <Box p={1} paddingBottom={3}>
      <Alert key={err} severity="error">
        {err}
      </Alert>
    </Box>
  ));
}

export function renderNotices(notices: string[]) {
    return notices.map((notice) => (
      <Box p={1} paddingBottom={3}>
        <Alert key={notice} severity="success">
          {notice}
        </Alert>
      </Box>
    ));
  }