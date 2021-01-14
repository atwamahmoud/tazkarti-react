import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { FC, useState } from "react";
import { createStadium } from "../../Services/Stadium";
import { renderErrors, renderNotices } from "../../Utils/renderers";

export const CreateStadium: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [notices, setNotices] = useState<string[]>([]);

  function handleWidthBlur(e: React.FocusEvent<HTMLInputElement>): void {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setWidth(parseInt(value));
  }
  function handleNameBlur(e: React.FocusEvent<HTMLInputElement>): void {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setName(value);
  }
  function handleLengthBlur(e: React.FocusEvent<HTMLInputElement>): void {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setLength(parseInt(value));
  }
  function handleLengthKeyPress(
    e: React.KeyboardEvent<HTMLInputElement>
  ): void {
    if (e.key !== "Enter") return;
    const { value } = e.target as HTMLInputElement;
    const int = parseInt(value);
    setLength(int);
    handleSubmit(length, int);
  }
  function handleNameKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== "Enter") return;
    const { value } = e.target as HTMLInputElement;
    setName(value);
    handleSubmit(length, width, name);
  }
  function handleWidthKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== "Enter") return;
    const { value } = e.target as HTMLInputElement;
    const int = parseInt(value);
    setWidth(int);
    handleSubmit(length, int);
  }
  async function handleSubmit(len = length, w = width, n = name) {
    setIsLoading(true);
    setErrors([]);
    const errors = await createStadium(len || 0, w || 0, n);
    setIsLoading(false);
    if (errors.length) {
      setErrors([...errors]);
      return;
    }
    setNotices([`Stadium "${name}" created successfully!`]);
  }

  function handleSubmitWrapper(): void {
    handleSubmit();
  }
  return (
    <Container maxWidth="sm">
      <Box p={4} component={Paper}>
        <Box paddingBottom={4}>
          <Typography variant="h5">Create Stadium</Typography>
        </Box>
        {renderErrors(errors)}
        {renderNotices(notices)}
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              disabled={isLoading}
              fullWidth
              onBlur={handleNameBlur}
              onKeyPress={handleNameKeyPress}
              label="Stadium name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              disabled={isLoading}
              fullWidth
              onBlur={handleLengthBlur}
              onKeyPress={handleLengthKeyPress}
              label="Length"
              variant="outlined"
              type="number"
            />
          </Grid>
          <Grid item xs="auto">
            <Typography variant="h4">×</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              disabled={isLoading}
              fullWidth
              onBlur={handleWidthBlur}
              onKeyPress={handleWidthKeyPress}
              label="Width"
              variant="outlined"
              type="number"
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              disabled={isLoading}
              onClick={handleSubmitWrapper}
              variant="contained"
              color="primary"
            >
              Create Stadium
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateStadium;
