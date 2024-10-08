import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, PokemonDataResponse } from '../model/models';


@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private readonly http = inject(HttpClient);

    getPokemons(next?: string): Observable<PokemonDataResponse> {
        return this.http.get<PokemonDataResponse>(next ?? 'https://pokeapi.co/api/v2/pokemon?&limit=151');
    }


    getPokemon(url: string): Observable<Pokemon> {
        return this.http.get<Pokemon>(url);
    }
}
