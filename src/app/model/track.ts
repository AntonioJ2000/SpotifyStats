import { user } from "./user";

export interface track{
    id?:string, //track.id
    trackThumbnail:any, //track.album.images (array)
    trackName:any, //track.name
    artists:any[], //track.artists (array)
    spotifyURL:any, //track.external_urls.spotify
    previewURL?:any //track.preview_url
    playedat?:any;
    usersSong?: Array<user>;
}