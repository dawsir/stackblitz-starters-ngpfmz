import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface PokemonResponse { 
  count: number;
  next: string;
  results: PokemonBasic[]
  previous?: string;
}

export interface PokemonBasic { 
  name: string;
  url: string
}


@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  http = inject(HttpClient)

  getPokemons(next?: string): Observable<PokemonResponse> {
   return this.http.get<PokemonResponse>(next ?? 'https://pokeapi.co/api/v2/pokemon?&limit=151')
  }

  
  getPokemon(url: string): Observable<PokemonResponse> {
    console.log(url);
   return this.http.get<PokemonResponse>(url)
  }
}
