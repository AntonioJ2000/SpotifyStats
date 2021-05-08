import { user } from "./user";

export interface artist{
    id?:any,
    usersArtists?: Array<user>;
    image: any,
    name:any,
    popularity:any,
    spotifyURL:any,
    followers:number,
}