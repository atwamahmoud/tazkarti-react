import { IMatch } from "../Interfaces/Match";
import { buildURL, getHeaders } from "./Auth";

export async function createMatch(match: IMatch):  Promise<string[]> {
    const errs = [];
    if(!match.awayTeam) {
        errs.push("Away team cannot be empty!");
    }
    if(!match.homeTeam) {
        errs.push("Home team cannot be empty!");
    }
    if(match.linesmen.length !== 2 && !match.linesmen.reduce((prev, curr) => prev+curr.trim(), "").length) {
        errs.push("Linesmen must be 2 & not empty!");
    }
    if(!match.referee.trim()) {
        errs.push("Referee cannot be empty!");
    }
    if(!match.stadium.trim()) {
        errs.push("Stadium cannot be empty!");
    }
    if(match.time.getTime() <= Date.now()) {
        errs.push("Match time must be in future!");
    }
    if(!match.ticketPrice || isNaN(match.ticketPrice)) {
        errs.push("Ticket price must be a valid number above 0!");
    }
    if(errs.length) {
        return errs;
    }

    const intermediate = await fetch(buildURL("/match"), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({...match})
    });
    const json = await intermediate.json();
    
    if(json.success) return [];
    return [json.result.message]
}

export async function updateMatch(match: IMatch, id: string):  Promise<string[]> {
    const errs = [];
    if(!match.awayTeam) {
        errs.push("Away team cannot be empty!");
    }
    if(!match.homeTeam) {
        errs.push("Home team cannot be empty!");
    }
    if(match.linesmen.length !== 2 && !match.linesmen.reduce((prev, curr) => prev+curr.trim(), "").length) {
        errs.push("Linesmen must be 2 & not empty!");
    }
    if(!match.referee.trim()) {
        errs.push("Referee cannot be empty!");
    }
    if(!match.stadium.trim()) {
        errs.push("Stadium cannot be empty!");
    }
    if(match.time.getTime() <= Date.now()) {
        errs.push("Match time must be in future!");
    }
    if(!match.ticketPrice || isNaN(match.ticketPrice)) {
        errs.push("Ticket price must be a valid number above 0!");
    }
    if(errs.length) {
        return errs;
    }

    const intermediate = await fetch(buildURL("/match/"+id), {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({...match})
    });
    const json = await intermediate.json();
    
    if(json.success) return [];
    return [json.result.message]
}

export async function getMatches(): Promise<IMatch[]> {
    const intermediate = await fetch(buildURL("/match"), {
        method: "GET",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.matches || []) as IMatch[];
    }
    return [];
}