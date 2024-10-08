import { AsyncPipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { map } from 'rxjs';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';
import { PokemonBasic, PokemonDataResponse } from './model/models';
import { PokemonService } from './services/pokemon.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        DropdownComponent,
        PokemonDetailsComponent,
        AsyncPipe,
    ],
    template: `
        <div class="wrapper">
            <h2 class="no-margin-bottom">PokeSelect</h2>
            <app-dropdown [items]="dropdownItems" (selectedItem)="selectedItem($event)"
                          (scrollEnd)="fetchMoreData()"></app-dropdown>
            @if (pokemon()) {
                <app-pokemon-details class="" [pokemon]="pokemon"></app-pokemon-details>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
    service: PokemonService = inject(PokemonService);
    dropdownItems = signal<PokemonBasic[]>([]);
    nextUrl = signal<string>('');
    pokemon = signal<any>(null);


    ngOnInit(): void {
        this.service.getPokemons().subscribe((value: PokemonDataResponse) => {
            this.nextUrl.set(value.next);
            this.dropdownItems.set(value.results.map(value => ({
                name: value.name.charAt(0).toUpperCase() + value.name.slice(1),
                url: value.url,
            })));
        });
    }

    selectedItem(item: PokemonBasic) {
        if (item) {
            this.service.getPokemon(item.url).pipe(map(({ name, sprites, weight }) => ({
                name: item.name,
                sprites,
                weight,
            }))).subscribe(pokemon => {
                this.pokemon.set(pokemon);
            });
        } else {
            this.pokemon.set(null);
        }
    }

    fetchMoreData() {
        this.service.getPokemons(this.nextUrl()).subscribe((value: PokemonDataResponse) => {
            this.nextUrl.set(value.next);
            this.dropdownItems.set([...this.dropdownItems(), ...value.results.map(value => ({
                ...value,
                name: value.name.charAt(0).toUpperCase() + value.name.slice(1),
            }))]);
        });
    }

}

bootstrapApplication(App, {
    providers: [
        provideHttpClient(),
    ],
});
