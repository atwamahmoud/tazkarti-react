import {
  Box,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { IMatch } from "../../Interfaces/Match";
import { IStadium } from "../../Interfaces/Stadium";
import { ITeam } from "../../Interfaces/Team";
import { ITicket } from "../../Interfaces/Ticket";
import { getMatches } from "../../Services/Match";
import { getStadiums } from "../../Services/Stadium";
import { getTeams } from "../../Services/Team";
import { cacnelTicket, getTickets } from "../../Services/Ticket";

export const Tickets: FC = () => {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [stadiums, setStadiums] = useState<IStadium[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStadiums().then(setStadiums);
    getTeams().then(setTeams);
    getMatches().then(setMatches);
    getTickets().then((tickets) => {
      setIsLoading(false);
      setTickets(tickets);
    });
  }, []);

  function getTitle(match: IMatch | undefined): string {
    if (!match) return "";
    const stadium = stadiums.find((std) => std.id === match.stadium);
    const awayTeam = teams.find((t) => t.id === match.awayTeam);
    const homeTeam = teams.find((t) => t.id === match.homeTeam);
    return `${stadium?.name} - ${awayTeam?.teamName} vs ${
      homeTeam?.teamName
    } - ${new Date(match.time).toLocaleString()}`;
  }

  if (isLoading)
    return (
      <Box p={2} component={Paper}>
        <Grid container spacing={2} justify="center">
          <Grid item xs="auto">
            <CircularProgress color="primary" />
          </Grid>
        </Grid>
      </Box>
    );

  if (tickets.length === 0 && !isLoading)
    return (
      <Box p={2} component={Paper}>
        <Grid container spacing={2} justify="center">
          <Grid item xs="auto">
            <Typography variant="body1">No tickets available</Typography>
          </Grid>
        </Grid>
      </Box>
    );

  return (
    <Box p={4}>
      {tickets.map((ticket) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <FormControlLabel
              control={<> </>}
              label={getTitle(matches.find(({ id }) => id === ticket.matchId))}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={async () => {
                await cacnelTicket(ticket._id);
                setTickets(tickets.filter(({ _id }) => _id !== ticket._id));
              }}
            >
              Cancel Ticket
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Tickets;
