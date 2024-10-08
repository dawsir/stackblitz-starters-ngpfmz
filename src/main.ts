import { Component, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { DropdownComponent } from './dropdown/dropdown.component';
import {PokemonService, PokemonResponse, PokemonBasic} from './pokemon.service'
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DropdownComponent,
  ],
  template: `
  <div class="wrapper">
  <h1>PokeSelect</h1>
    <app-dropdown></app-dropdown>

  </div>

  `,
})
export class App implements OnInit {
  service: PokemonService = inject(PokemonService);
  pokemons: BehaviorSubject<PokemonBasic[]> = new BehaviorSubject<PokemonBasic[]>([]);

  ngOnInit(): void {
    this.service.getPokemons().subscribe((value: PokemonResponse) => {
      this.pokemons.next(value.results);
      console.log(value);
    })
  }
}

bootstrapApplication(App, {providers: [
  provideHttpClient(),
]});
