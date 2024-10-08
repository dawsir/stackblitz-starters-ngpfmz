import { Component, Input, WritableSignal } from '@angular/core';
import { PokemonDetails } from '../../model/models';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [],
  template: `
      @if (pokemon()) {
          <div class="details-wrapper">
              <img [src]="pokemon().sprites.back_default" [alt]="pokemon().name">
            <div class="detail">
              <span>{{pokemon().name}}</span>
              <span class="weight-text">Weight: {{pokemon().weight}}</span>
            </div>
          </div>
      }
  `,
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent {
  @Input() pokemon!: WritableSignal<PokemonDetails>;
}
