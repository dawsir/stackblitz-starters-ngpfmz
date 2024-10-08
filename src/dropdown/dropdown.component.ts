import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  template: `
    <p>
      dropdown works!
    </p>
  `,
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {

}
