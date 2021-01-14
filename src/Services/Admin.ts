import { IUser } from "../Interfaces/User";
import { buildURL, getHeaders } from "./Auth";

export async function getUsers(): Promise<IUser[]> {
    const intermediate = await fetch(buildURL("/users"), {
        method: "GET",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return (json.result?.users || []) as IUser[];
    }
    return [];
}

export async function deleteUser(userId: string): Promise<string[]> {
    const intermediate = await fetch(buildURL("/users/"+userId), {
        method: "DELETE",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return [];
    }
    return [json?.result?.message || ""]
}
export async function toggleValidation(userId: string): Promise<string[]> {
    const intermediate = await fetch(buildURL("/users/"+userId+"/toggleValid"), {
        method: "PUT",
        headers: getHeaders()
    });
    const json = await intermediate.json();

    if(json.success) {
        return [];
    }
    return [json?.result?.message || ""]
}