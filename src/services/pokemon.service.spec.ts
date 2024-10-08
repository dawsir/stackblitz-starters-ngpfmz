import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonDataResponse } from '../model/models';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });
    service = TestBed.inject(PokemonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getPokemons', () => {
    it('should call the correct URL and return a list of pokemons', () => {
      const mockResponse: PokemonDataResponse = {
        count: 151,
        next: '',
        previous: '',
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      service.getPokemons().subscribe((data) => {
        expect(data.count).toBe(151);
        expect(data.results.length).toBe(2);
        expect(data.results[0].name).toBe('bulbasaur');
      });

      const req = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon?&limit=151');
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should call the correct URL when a custom "next" URL is provided', () => {
      const nextUrl = 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20';
      const mockResponse: PokemonDataResponse = {
        count: 151,
        next: '',
        previous: '',
        results: [
          { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
        ],
      };

      service.getPokemons(nextUrl).subscribe((data) => {
        expect(data.results[0].name).toBe('venusaur');
      });

      const req = httpTestingController.expectOne(nextUrl);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('getPokemon', () => {
    it('should return details of a specific pokemon', () => {
      const mockPokemon: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
      } as Pokemon;

      const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/1/';

      service.getPokemon(pokemonUrl).subscribe((data) => {
        expect(data.name).toBe('bulbasaur');
        expect(data.height).toBe(7);
      });

      const req = httpTestingController.expectOne(pokemonUrl);
      expect(req.request.method).toBe('GET');

      req.flush(mockPokemon);
    });
  });
});
