export interface ISeat {
    x: number;
    y: number;
    isReserved: boolean;
    ticketId?: string;
}
export interface IMatch {
    time: Date,
    homeTeam: string,
    awayTeam: string,
    stadium: string,
    referee: string,
    seats?: ISeat[],
    linesmen: string[],
    ticketPrice: number,
    id?: string,
}