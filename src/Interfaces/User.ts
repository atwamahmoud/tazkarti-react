export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  address: string,
  username: string,
  gender: "Male" | "Female",
  city: string,
  birthDate: string,
  role: "Manager" | "Fan",
  isValid: boolean,
}