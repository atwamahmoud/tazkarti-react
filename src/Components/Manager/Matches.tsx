import {
  Box,
  Table,
  Tooltip,
  TableRow,
  TableCell,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableContainer,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import { EventSeat, ExpandMore } from "@material-ui/icons";
import { Link } from "@reach/router";
import React, { FC, useEffect, useState } from "react";
import { IMatch, ISeat } from "../../Interfaces/Match";
import { IStadium } from "../../Interfaces/Stadium";
import { ITeam } from "../../Interfaces/Team";
import { getMatches } from "../../Services/Match";
import { getStadiums } from "../../Services/Stadium";
import { getTeams } from "../../Services/Team";

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
  return (
    <Box p={4}>
      {matches.map((match) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <FormControlLabel
              control={
                <Box p={2}>
                  <Button variant="text">
                    <Link to={`/match/${match.id}`}>Edit</Link>
                  </Button>
                </Box>
              }
              label={getTitle(match)}
            />
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                {get2DArray(match.seats).map((row) => (
                  <TableRow>
                    {row.map(({ isReserved }) => (
                      <TableCell>
                        <Tooltip title={isReserved ? "Reserved" : "Free"}>
                          <EventSeat
                            color={isReserved ? "primary" : "secondary"}
                          />
                        </Tooltip>
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
  );
};

export default Matches;
