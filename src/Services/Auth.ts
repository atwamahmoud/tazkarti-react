

export function buildURL(endpoint = "/"): string {
    return `http://localhost:1337${endpoint}`;
}

let user: any = JSON.parse(localStorage.getItem("user") || (null as any));
if(new Date(user?.token?.expiry).getTime() <= Date.now()) {
    user = null;
}

window?.addEventListener("beforeunload", () => {
    if(!user) return;
    localStorage.setItem("user", JSON.stringify(user));
});

export function getUser(): any {
    return user;
}

export function getHeaders(): Headers {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if(user) {
        headers.set("token", user?.token?.value);
        headers.set("user-id", user?.userId || user?.id);
    }
    return headers;
}

export function logout() {
    user = null;
    localStorage.setItem("user", "");
} 

export function isAuth() {
    return user !== null;
}

export async function login(username: string, password: string): Promise<string[]> {
    const errors = [];
    if(!username.trim()) {
        errors.push("Username cannot be empty!");
    }
    if(!password.trim()) {
        errors.push("Password cannot be empty!");
    }
    if(errors.length > 0) return errors;    

    const intermediate = await fetch(buildURL("/login"), {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers: getHeaders(),
    });

    const {result, success} = (await intermediate.json());
    
    if(!success) {
        return [result.message]
    }

    user = {...result};

    return [];
}
type SignUpData = {
    role: "Fan"|"Manager",//
    city: string,//
    email: string,//
    birthDate: string,//
    lastName: string,//
    firstName: string,//
    address?: string,
    password?: string,//
    username: string,//
    gender: "Male"|"Femail",//
}
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
function validateEmail(email: string): boolean {
    return emailRegex.test(email);
}
export async function signup(data: SignUpData): Promise<string[]> {
    const errors = [];
    if(!validateEmail(data.email)) {
        errors.push("Invalid E-Mail address!");
    }
    if(!data.password || data.password?.length < 6) {
        errors.push("Password must be at least 6 characters!");
    }
    if(data.username.length < 4) {
        errors.push("Username must be at least 4 characters!");
    }
    if(!["Fan", "Manager"].includes(data.role)) {
        errors.push("Invalid role!");
    }
    if(!["Male", "Female"].includes(data.gender)) {
        errors.push("Invalid gender!");
    }
    if(!data.birthDate.trim()) {
        errors.push("Invalid Birth date!");
    }
    if(!data.lastName.trim()) {
        errors.push("Invalid Last name!");
    }
    if(!data.firstName.trim()) {
        errors.push("Invalid First name!");
    }
    if(!data.city.trim()) {
        errors.push("Invalid city!");
    }
    if(errors.length > 0) {
        return errors;
    }
    const inter = await fetch(buildURL("/user"), {
        method: "POST",
        body: JSON.stringify(data),
        headers: getHeaders(),
    });
    const {result, success} = await inter.json();
    if(!success) {
        return [result.message]
    }
    user = result;
    return [];
}

export interface IUserData extends Omit<Omit<SignUpData, "username">, "email"> {
    currentPassword?: string
}

export async function editData(data: IUserData): Promise<string[]> {
    const errors = [];
    if(data.password) {
        if(data.password?.length < 6) {
            errors.push("New Password must be at least 6 characters!");
        }
        if(data.currentPassword && data.currentPassword?.length < 6) {
            errors.push("Current Password must be at least 6 characters!");
        }
    }
    if(!["Fan", "Manager"].includes(data.role)) {
        errors.push("Invalid role!");
    }
    if(!["Male", "Female"].includes(data.gender)) {
        errors.push("Invalid gender!");
    }
    if(!data.birthDate.trim()) {
        errors.push("Invalid Birth date!");
    }
    if(!data.lastName.trim()) {
        errors.push("Invalid Last name!");
    }
    if(!data.firstName.trim()) {
        errors.push("Invalid First name!");
    }
    if(!data.city.trim()) {
        errors.push("Invalid city!");
    }
    if(errors.length > 0) {
        return errors;
    }
    const inter = await fetch(buildURL("/user"), {
        method: "PUT",
        body: JSON.stringify(data),
        headers: getHeaders(),
    });
    const {result, success} = await inter.json();
    if(!success) {
        return [result.message]
    }
    user = result;
    return [];
}