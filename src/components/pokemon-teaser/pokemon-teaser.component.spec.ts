import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonTeaserComponent } from './pokemon-teaser.component';
import { signal } from '@angular/core';
import { PokemonTeaser } from '../../model/models';

describe('PokemonDetailsComponent', () => {
    let component: PokemonTeaserComponent;
    let fixture: ComponentFixture<PokemonTeaserComponent>;

    const mockPokemon: PokemonTeaser = {
        name: 'Pikachu',
        weight: 60,
        sprite: 'https://example.com/pikachu.png',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PokemonTeaserComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PokemonTeaserComponent);
        component = fixture.componentInstance;
        component.pokemon = signal(mockPokemon); // Initialize with mock data
        fixture.detectChanges(); // Trigger change detection
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct pokemon details', () => {
        const imgElement = fixture.nativeElement.querySelector('img');
        const nameElement = fixture.nativeElement.querySelector('span');
        const weightElement = fixture.nativeElement.querySelector('.weight-text');

        expect(imgElement.src).toContain(mockPokemon.sprite);
        expect(nameElement.textContent).toContain(mockPokemon.name);
        expect(weightElement.textContent).toContain(`Weight: ${mockPokemon.weight}`);
    });

    it('should not display details if pokemon is not provided', () => {
        component.pokemon = signal({} as PokemonTeaser); // Set pokemon to null
        fixture.detectChanges(); // Trigger change detection

        const detailsWrapper = fixture.nativeElement.querySelector('.details-wrapper');
        expect(detailsWrapper).toBeNull(); // Ensure details are not rendered
    });
});
