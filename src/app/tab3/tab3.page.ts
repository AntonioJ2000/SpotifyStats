import { Component } from '@angular/core';
import { artist } from '../model/artist';
import { track } from '../model/track';
import { SpotifyApiService } from '../services/spotify-api.service';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  listaTopCanciones: track[] = []; 
  listaTopArtistas: artist[] = [];
  listaEscuchadasRecientemente: track[] = [];

  constructor(private spotifyApi:SpotifyApiService) {}

  ngOnInit(){
    this.getUserTopTracks();
    this.getUserTopArtists();
    this.getUserRecentlyPlayed();
  }

  public async getUserTopTracks(){
    let t = await this.spotifyApi.getCurrentUserTopTracks();
    let songList:any[] = t.items;

    
    for(let i=0; i < songList.length; i++){
      let trackToView:track = {
        id: songList[i].id,
        trackName: songList[i].name,
        spotifyURL: songList[i].external_urls.spotify,
        previewURL: songList[i].preview_url,
        artists: songList[i].artists,
        trackThumbnail: songList[i].album.images[1].url
      }  
      this.listaTopCanciones.push(trackToView);
    }
  }

  public async getUserTopArtists(){
    let t = await this.spotifyApi.getCurrentUserTopArtists();
    let artistList:any[] = t.items;

    for(let i=0; i < artistList.length; i++){
      let artistToView:artist = {
        image: artistList[i].images[1].url,
        name: artistList[i].name,
        popularity: artistList[i].popularity,
        spotifyURL: artistList[i].external_urls.spotify,
        followers: artistList[i].followers.total
      }
      this.listaTopArtistas.push(artistToView);
    }
  }

  public async getUserRecentlyPlayed(){
    let t = await this.spotifyApi.getCurrentUserRecentlyPlayed();
    let songList:any[] = t.items;

    for(let i=0; i < songList.length; i++){
      let trackToView:track = {
        id: songList[i].track.id,
        trackName: songList[i].track.name,
        spotifyURL: songList[i].track.external_urls.spotify,
        previewURL: songList[i].track.preview_url,
        artists: songList[i].track.artists,
        trackThumbnail: songList[i].track.album.images[1].url,
        playedat: songList[i].played_at
      }  
      this.listaEscuchadasRecientemente.push(trackToView);
    }
    
    console.log(this.listaEscuchadasRecientemente)

  }
}
