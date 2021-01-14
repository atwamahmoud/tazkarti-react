import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import React, { FC, useState } from "react";
import TopBar from "../../Components/TopBar";
import { signup } from "../../Services/Auth";
import { renderErrors } from "../../Utils/renderers";

const SignUp: FC<RouteComponentProps> = () => {
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  function setEntry(key: string, value: string): void {
    setData({ ...data, [key]: value });
  }

  function setUsername(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("username", e.target.value.trim());
  }
  function setPassword(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("password", e.target.value.trim());
  }
  function setFirstName(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("firstName", e.target.value.trim());
  }
  function setLastName(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("lastName", e.target.value.trim());
  }
  function setBirthDate(e: React.ChangeEvent<HTMLInputElement>): void {
    setEntry("birthDate", new Date(e.target.value).toISOString());
  }
  function setGender(e: React.ChangeEvent<HTMLInputElement>): void {
    setEntry("gender", e.target.value || "");
  }
  function setCity(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("city", e.target.value);
  }
  function setAddress(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("address", e.target.value);
  }
  function setEmail(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("email", e.target.value);
  }
  function setRole(e: React.FocusEvent<HTMLInputElement>): void {
    setEntry("role", e.target.value || "");
  }

  async function handleSubmit() {
    setErrors([]);
    const errors = await signup({ ...data } as any);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    navigate("/");
  }
  function getDate(date: string): string | null {
    if (!date) return null;
    const _date = new Date(date);
    const y = _date.getFullYear();
    const m =
      (_date.getMonth() + 1).toString().length > 1
        ? _date.getMonth() + 1
        : `0${_date.getMonth() + 1}`;
    const d =
      _date.getDate().toString().length > 1
        ? _date.getDate()
        : `0${_date.getDate()}`;
    return `${y}-${m}-${d}`;
  }
  return (
    <>
      <TopBar isValid={false} isAuth={false} />
      <Container maxWidth="sm">
        <Box p={3} marginTop={16} component={Paper}>
          <Typography variant="h4">Sign up</Typography>
          {renderErrors(errors)}
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  placeholder="e.g. Bob_Ross"
                  label="Username"
                  onBlur={setUsername}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  placeholder="e.g. example@example.com"
                  label="E-Mail"
                  onBlur={setEmail}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  placeholder="e.g. Bob"
                  label="First Name"
                  onBlur={setFirstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  placeholder="e.g. Bob"
                  label="Last Name"
                  onBlur={setLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="Password"
                  type="password"
                  onBlur={setPassword}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="Gender"
                  select
                  onChange={setGender}
                  value={data.gender || ""}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="Role"
                  select
                  onChange={setRole}
                  value={data.role || ""}
                >
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Fan">Fan</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Birthdate</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="date"
                  color="primary"
                  // label="Birth date"
                  onChange={setBirthDate}
                  value={getDate(data.birthDate) || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="City"
                  placeholder="e.g. Cairo"
                  onBlur={setCity}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="Address"
                  placeholder="e.g. 512 Giza St."
                  onBlur={setAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography paragraph variant="body1">
                  Already have an account? <Link to="/login">Log in.</Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box paddingLeft={6} paddingRight={6}>
                  <Button
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
