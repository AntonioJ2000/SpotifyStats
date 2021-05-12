import { artist } from "./artist"
import { track } from "./track";

export interface user{
    id?: string,
    displayName: string,
    followers: number,
    image: string,
    spotifyURL: string,
    artists?: Array<artist>,
    tracks?: Array<track>
}