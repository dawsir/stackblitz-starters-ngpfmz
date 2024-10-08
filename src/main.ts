import { Component, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {PokemonService, PokemonResponse, PokemonBasic} from './pokemon.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  ],
  template: `
  <div class="title">
  <h1>PokeSelect</h1>
</div> 
<div class="dropdown">
</div>
<div class="details">
</div> 
    <!-- <app-dropdown></app-dropdown> -->
  `,
})
export class App implements OnInit {
  service: PokemonService = inject(PokemonService);
  pokemons: BehaviorSubject<PokemonBasic[]> = new BehaviorSubject([]);

  ngOnInit(): void {
    this.service.getPokemons().subscribe((value: PokemonResponse) => {
      console.log(value);
    })
  }
}

bootstrapApplication(App, {providers: [
  provideHttpClient(),
]});
