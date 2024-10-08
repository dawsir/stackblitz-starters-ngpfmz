import { Component, Input, WritableSignal } from '@angular/core';
import { PokemonTeaser } from '../../model/models';

@Component({
  selector: 'app-pokemon-teaser',
  standalone: true,
  imports: [],
  template: `
      @if (pokemon()) {
          <div class="details-wrapper">
              <img [src]="pokemon().sprite" [alt]="pokemon().name">
            <div class="detail">
              <span>{{pokemon().name}}</span>
              <span class="weight-text">Weight: {{pokemon().weight}}</span>
            </div>
          </div>
      }
  `,
  styleUrl: './pokemon-teaser.component.css'
})
export class PokemonTeaserComponent {
  @Input() pokemon!: WritableSignal<PokemonTeaser>;
}
