import { ITeam } from "../Interfaces/Team";
import { buildURL, getHeaders } from "./Auth";

export async function getTeams(): Promise<ITeam[]> {
    const intermediate = await fetch(buildURL("/team"), {
        method: "GET",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.teams || []) as ITeam[];
    }
    return [];
}