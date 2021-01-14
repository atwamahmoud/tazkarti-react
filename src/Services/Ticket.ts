import { ITicket } from "../Interfaces/Ticket";
import { buildURL, getHeaders } from "./Auth";

export async function buyTicket(matchId: string, data: {
    pin: string,
    creditCard: string,
    x: number,
    y: number
}):  Promise<string[]> {
    const errs = [];
    if((data.creditCard || "").length !== 16) {
        errs.push("Credit card number must be equal to 16!");
    }
    if((data.pin || "").length !== 4) {
        errs.push("Pin number must be equal to 4!");
    }
    console.log(data);
    if(data.x < 0) {
        errs.push("X must be equal to or greater than 0!");
    }
    if(data.y < 0) {
        errs.push("Y must be equal to or greater than 0!");
    }
    if(errs.length) {
        return errs;
    }

    const intermediate = await fetch(buildURL("/match/"+matchId+"/ticket"), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({...data})
    });
    const json = await intermediate.json();
    
    if(json.success) return [];
    return [json.result.message]
}



export async function getTickets(): Promise<ITicket[]> {
    const intermediate = await fetch(buildURL("/tickets"), {
        method: "GET",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.tickets || []) as ITicket[];
    }
    return [];
}

export async function cacnelTicket(id: string): Promise<ITicket[]> {
    const intermediate = await fetch(buildURL("/tickets/"+id), {
        method: "PUT",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.tickets || []) as ITicket[];
    }
    return [];
}