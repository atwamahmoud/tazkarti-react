import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import {
  Autocomplete,
  createFilterOptions,
  FilterOptionsState,
} from "@material-ui/lab";
import { DateTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { FC, useEffect, useState } from "react";
import { IStadium } from "../../Interfaces/Stadium";
import { ITeam } from "../../Interfaces/Team";
import { createMatch } from "../../Services/Match";
import { getStadiums } from "../../Services/Stadium";
import { getTeams } from "../../Services/Team";
import { renderErrors, renderNotices } from "../../Utils/renderers";

const filter = createFilterOptions();

function generateOption(value: string): string {
  return `Click here to add "${value}"`;
}

export function creatableFilter(
  options: any[],
  params: FilterOptionsState<any>
): string[] {
  const filtered = filter(options, params);
  const { inputValue } = params;

  if (inputValue !== "") {
    filtered.push(generateOption(inputValue));
  }

  return filtered as string[];
}

export function filterTag(tag: string): string {
  const filteringRegex = /[^"]+"(.*)"$/;
  const matched = tag.match(filteringRegex);
  return matched ? matched[1] : tag;
}

export function filterCreatableAutocomplete(tags: string[]): string[] {
  return tags.map(filterTag);
}

export const CreateMatch: FC = () => {
  const [stadiums, setStadiums] = useState<IStadium[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [stadiumId, setStadiumId] = useState<string>("");
  const [refereeName, setRefereeName] = useState<string>("");
  const [linesMen, setLinesMen] = useState<string[]>([]);
  const [errs, setErrors] = useState<string[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [ticketPrice, setTicketPrice] = useState<number>();

  useEffect(() => {
    getStadiums().then((stadiums) => setStadiums(stadiums));
    getTeams().then((teams) => setTeams(teams));
  }, []);

  function renderHomeTeamOptions(): JSX.Element[] {
    return teams.map(({ id, teamName }) => (
      <MenuItem key={id} value={id} disabled={id === awayTeamId}>
        {teamName}
      </MenuItem>
    ));
  }
  function renderAwayTeamOptions(): JSX.Element[] {
    return teams.map(({ id, teamName }) => (
      <MenuItem key={id} value={id} disabled={id === homeTeamId}>
        {teamName}
      </MenuItem>
    ));
  }
  function renderStadiumOptions(): JSX.Element[] {
    return stadiums.map(({ id, name }) => (
      <MenuItem key={id} value={id}>
        {name}
      </MenuItem>
    ));
  }
  function handleStadiumIdChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setStadiumId(e.target.value);
  }
  function handleAwayTeamIdChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAwayTeamId(e.target.value);
  }
  function handleHomeTeamIdChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setHomeTeamId(e.target.value);
  }
  function handleLinesMenChange(e: React.ChangeEvent<{}>, values: unknown) {
    const casted = values as string[];
    const newValues = casted?.slice(0, 2) || [];
    setLinesMen(filterCreatableAutocomplete(newValues));
  }
  function handleRefereeNameBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { value } = e.target;
    setRefereeName(value);
  }
  function handleTimeChange(date: MaterialUiPickersDate): void {
    setTime(new Date(date?.getTime() || ""));
  }
  function handleTicketPriceChange(e: React.FocusEvent<HTMLInputElement>): void {
    const {value} = e.target;
    const num = parseFloat(value);
    setTicketPrice(num);
  }
  async function handleSubmit(): Promise<void> {
    setIsLoading(true);
    const errs = await createMatch({
      homeTeam: homeTeamId,
      awayTeam: awayTeamId,
      referee: refereeName,
      stadium: stadiumId,
      time,
      linesmen: linesMen,
      ticketPrice: ticketPrice || 0
    });
    setIsLoading(false);
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setNotices(["Match Successfully Created"]);
  }
  return (
    <Container maxWidth="sm">
      <Box p={4} component={Paper}>
        <Box paddingBottom={4}>
          <Typography variant="h5">Create Match</Typography>
        </Box>
        {renderErrors(errs)}
        {renderNotices(notices)}
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              disabled={isLoading}
              fullWidth
              label="Stadium"
              variant="outlined"
              value={stadiumId}
              onChange={handleStadiumIdChange}
              select
            >
              {renderStadiumOptions()}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled={isLoading}
              fullWidth
              label="Away Team"
              variant="outlined"
              value={awayTeamId}
              onChange={handleAwayTeamIdChange}
              select
            >
              {renderAwayTeamOptions()}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled={isLoading}
              fullWidth
              label="Home Team"
              value={homeTeamId}
              variant="outlined"
              onChange={handleHomeTeamIdChange}
              select
            >
              {renderHomeTeamOptions()}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={isLoading}
              fullWidth
              label="Referee name"
              variant="outlined"
              onBlur={handleRefereeNameBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disabled={isLoading}
              options={[]}
              multiple
              noOptionsText={"Type a name to add"}
              filterOptions={creatableFilter}
              fullWidth
              value={linesMen || []}
              onChange={handleLinesMenChange}
              renderInput={(params) => (
                <TextField variant="outlined" label="Linesmen" {...params} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              label="Match Time"
              inputVariant="outlined"
              showTodayButton
              fullWidth
              disabled={isLoading}
              value={time}
              onChange={handleTimeChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              label="Ticket Price"
              variant="outlined"
              fullWidth
              disabled={isLoading}
              onBlur={handleTicketPriceChange}
            />
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained" onClick={handleSubmit} color="primary">
              Create Match
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateMatch;
