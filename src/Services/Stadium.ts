import { IStadium } from "../Interfaces/Stadium";
import { buildURL, getHeaders } from "./Auth";

export async function createStadium(length: number, width: number, name: string):  Promise<string[]> {
    const errs = [];
    if(!name?.trim()) {
        errs.push("Name cannot be empty!");
    }
    if(length <= 0) {
        errs.push("Length must be greater than 0!");
    }
    if(width <= 0) {
        errs.push("Width must be greater than 0!");
    }
    if(errs.length) {
        return errs;
    }

    const intermediate = await fetch(buildURL("/stadium"), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({length, width, name})
    });
    const json = await intermediate.json();
    
    if(json.success) return [];
    return [json.result.message]
}

export async function getStadiums(): Promise<IStadium[]> {
    const intermediate = await fetch(buildURL("/stadium"), {
        method: "GET",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.stadiums || []) as IStadium[];
    }
    return [];
}