import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { signal } from '@angular/core';
import { PokemonDetails } from '../../model/models';

describe('PokemonDetailsComponent', () => {
    let component: PokemonDetailsComponent;
    let fixture: ComponentFixture<PokemonDetailsComponent>;

    const mockPokemon: PokemonDetails = {
        name: 'Pikachu',
        weight: 60,
        sprites: {
            back_default: 'https://example.com/pikachu.png',
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PokemonDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PokemonDetailsComponent);
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

        expect(imgElement.src).toContain(mockPokemon.sprites.back_default);
        expect(nameElement.textContent).toContain(mockPokemon.name);
        expect(weightElement.textContent).toContain(`Weight: ${mockPokemon.weight}`);
    });

    it('should not display details if pokemon is not provided', () => {
        component.pokemon = signal({} as PokemonDetails); // Set pokemon to null
        fixture.detectChanges(); // Trigger change detection

        const detailsWrapper = fixture.nativeElement.querySelector('.details-wrapper');
        expect(detailsWrapper).toBeNull(); // Ensure details are not rendered
    });
});
