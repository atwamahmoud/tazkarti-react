import {
  Box,
  Table,
  Grid,
  TableRow,
  TableCell,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableContainer,
  FormControlLabel,
  Button,
  Dialog,
  TextField,
  Typography,
} from "@material-ui/core";
import { EventSeat, ExpandMore } from "@material-ui/icons";
import { navigate } from "@reach/router";
import React, { FC, useEffect, useState } from "react";
import { IMatch, ISeat } from "../../Interfaces/Match";
import { IStadium } from "../../Interfaces/Stadium";
import { ITeam } from "../../Interfaces/Team";
import { getMatches } from "../../Services/Match";
import { getStadiums } from "../../Services/Stadium";
import { getTeams } from "../../Services/Team";
import { buyTicket } from "../../Services/Ticket";
import { renderErrors, renderNotices } from "../../Utils/renderers";

function get2DArray(seats: ISeat[] = []): ISeat[][] {
  return seats.reduce((acc, curr) => {
    const newArr = acc;
    if (!acc[curr.x]) {
      newArr[curr.x] = [];
    }
    newArr[curr.x].push(curr);
    return newArr;
  }, [] as ISeat[][]);
}

let timer: any;

function shortPoll(setter: (matches: IMatch[]) => void) {
  getMatches().then((matches) => {
    setter(matches);
    timer = window.setTimeout(() => {
      shortPoll(setter);
    }, 4000);
  });
}

export const Matches: FC = () => {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [stadiums, setStadiums] = useState<IStadium[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [activeMatch, setActiveMatch] = useState<string>("");
  const [selectedX, setSelectedX] = useState<number>();
  const [selectedY, setSelectedY] = useState<number>();
  const [buyErrors, setBuyErrors] = useState<string[]>([]);
  const [buyNotices, setBuyNotices] = useState<string[]>([]);
  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const [ccNum, setCcNum] = useState("");
  const [pinNum, setPinNum] = useState("");

  useEffect(() => {
    getStadiums().then(setStadiums);
    getTeams().then(setTeams);
  }, []);

  useEffect(() => {
    shortPoll(setMatches);
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  function getTitle(match: IMatch): string {
    const stadium = stadiums.find((std) => std.id === match.stadium);
    const awayTeam = teams.find((t) => t.id === match.awayTeam);
    const homeTeam = teams.find((t) => t.id === match.homeTeam);
    return `${stadium?.name} - ${awayTeam?.teamName} vs ${
      homeTeam?.teamName
    } - ${new Date(match.time).toLocaleString()}`;
  }

  function getClickHandler(matchId: string, x: number, y: number): () => void {
    return (): void => {
      setActiveMatch(matchId);
      setSelectedX(x);
      setSelectedY(y);
    };
  }

  return (
    <>
      <Box p={4}>
        {matches.map((match) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <FormControlLabel control={<> </>} label={getTitle(match)} />
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  {get2DArray(match.seats).map((row, i) => (
                    <TableRow>
                      {row.map(({ isReserved }, j) => (
                        <TableCell>
                          <Button
                            onClick={getClickHandler(match?.id || "", i, j)}
                            color="primary"
                            disabled={isReserved}
                            variant="text"
                          >
                            <EventSeat />
                          </Button>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Dialog open={activeMatch.length > 0} maxWidth="sm">
        <Box p={4}>
          <Box paddingBottom={2}>
            <Typography variant="h6">
              Buy ({selectedX}, {selectedY}) Ticket for:{" "}
              {matches.find(({ id }) => id === activeMatch)?.ticketPrice} EGP
            </Typography>
          </Box>
          {renderErrors(buyErrors)}
          {renderNotices(buyNotices)}
          <TextField
            fullWidth
            disabled={isLoadingBuy}
            label="Credit Card number (16-digit)"
            variant="outlined"
            onBlur={({ target }) => {
              setCcNum(target.value);
            }}
          />
          <Box p={1} />
          <TextField
            fullWidth
            disabled={isLoadingBuy}
            label="Pin Number (4-digits)"
            variant="outlined"
            onBlur={({ target }) => {
              setPinNum(target.value);
            }}
          />
          <Box p={1} />
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={6}>
              <Button
                fullWidth
                disabled={isLoadingBuy}
                color="primary"
                variant="contained"
                onClick={async () => {
                  setIsLoadingBuy(true);
                  const errors = await buyTicket(activeMatch, {
                    x: selectedX !== undefined ? selectedX : -1,
                    y: selectedY !== undefined ? selectedY : -1,
                    creditCard: ccNum,
                    pin: pinNum,
                  });
                  setIsLoadingBuy(false);
                  if (errors.length) {
                    setBuyErrors(errors);
                    return;
                  }
                  navigate("/tickets");
                }}
              >
                Buy Now!
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                disabled={isLoadingBuy}
                color="primary"
                fullWidth
                variant="outlined"
                onClick={() => {
                  setActiveMatch("");
                  setSelectedX(-1);
                  setSelectedY(-1);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

export default Matches;
