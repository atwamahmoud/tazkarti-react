import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import React, { FC, useState } from "react";
import TopBar from "../../Components/TopBar";
import { login } from "../../Services/Auth";
import { renderErrors } from "../../Utils/renderers";

const Login: FC<RouteComponentProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleUsernameChange(e: React.FocusEvent<HTMLInputElement>): void {
    setUsername(e.target.value.trim());
  }
  function handlePasswordChange(e: React.FocusEvent<HTMLInputElement>): void {
    setPassword(e.target.value.trim());
  }

  function handleKeyPressUsername(
    e: React.KeyboardEvent<HTMLDivElement>
  ): void {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setUsername(value);
    handleSubmit(value, password);
  }

  function handleKeyPressPassword(
    e: React.KeyboardEvent<HTMLDivElement>
  ): void {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setPassword(value);
    handleSubmit(username, value);
  }

  async function handleSubmit(user = username, psw = password) {
    setIsLoading(true);
    setErrors([]);
    const errors = await login(user, psw);
    setIsLoading(false);
    if (errors.length) {
      setErrors([...errors]);
      return;
    }
    navigate("/");
  }

  function handleSubmitWrapper(): void {
    handleSubmit();
  }

  return (
    <>
      <TopBar isValid={false} isAuth={false} />
      <Container maxWidth="sm">
        <Box p={3} marginTop={16} component={Paper}>
          <Typography variant="h4">Login</Typography>
          {renderErrors(errors)}
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled={isLoading}
                  color="primary"
                  placeholder="e.g. Bob_Ross"
                  label="Username"
                  onBlur={handleUsernameChange}
                  onKeyPress={handleKeyPressUsername}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  label="Password"
                  disabled={isLoading}
                  type="password"
                  onBlur={handlePasswordChange}
                  onKeyPress={handleKeyPressPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography paragraph variant="body1">
                  Don't have an account? <Link to="/sign-up">Sign up.</Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box paddingLeft={6} paddingRight={6}>
                  <Button
                    disabled={isLoading}
                    onClick={handleSubmitWrapper}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {isLoading && "Loading..."}
                    {!isLoading && "Login"}
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

export default Login;
