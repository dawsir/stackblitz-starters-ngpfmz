import { AsyncPipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';
import { PokemonBasic, PokemonResponse, PokemonService } from './services/pokemon.service';

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
            <h1>PokeSelect</h1>
            <app-dropdown [items]="dropdownItems" (selectedItem)="selectedItem($event)" (scrollEnd)="fetchMoreData()"></app-dropdown>
            @if (false) {
                <app-pokemon-details></app-pokemon-details>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
    service: PokemonService = inject(PokemonService);
    dropdownItems = signal<PokemonBasic[]>([]);
    nextUrl = signal<string>('');


    ngOnInit(): void {
        this.service.getPokemons().subscribe((value: PokemonResponse) => {
            console.log(value);
            // this.nextUrl.set(value.next)
            this.dropdownItems.set(value.results.map(value => ({
                name: value.name.charAt(0).toUpperCase() + value.name.slice(1),
                url: value.url,
            })));
        });
    }

    selectedItem(item: PokemonBasic) {
        console.log(item);
    }

    fetchMoreData() {
        console.log('end');
        this.service.getPokemons().subscribe((value: PokemonResponse) => {
            console.log(value);
            this.dropdownItems.set(value.results.map(value => ({
                name: value.name.charAt(0).toUpperCase() + value.name.slice(1),
                url: value.url,
            })));
        });
    }

}

bootstrapApplication(App, {
    providers: [
        provideHttpClient(),
    ],
});
