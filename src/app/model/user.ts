import { artist } from "./artist"
import { track } from "./track";

export interface user{
    id?: any,
    displayName: string,
    followers: number,
    image: string,
    spotifyURL: string,
    artists?: Array<artist>,
    tracks?: Array<track>
}