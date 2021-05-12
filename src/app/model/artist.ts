import { user } from "./user";

export interface artist{
    id?:string,
    usersArtists?: Array<user>;
    image: any,
    name:any,
    popularity:any,
    spotifyURL:any,
    followers:number,
}