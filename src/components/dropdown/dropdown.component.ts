import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    EventEmitter,
    input,
    Input,
    InputSignal,
    Output, signal,
    WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        NgClass,
    ],
    template: `
        <div class="dropdown-wrapper">
            <label class="label" for="select">Favourite character</label>
            <div class="input-wrapper">
                <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (click)="showDropdown.set(true)"
                    (blur)="hideDropdown()"
                    (input)="onSearch($event)"
                    placeholder="Choose your favourite..."
                    class="input"
                />
                @if (searchTerm) {
                    <button class="clear-button" (click)="clearInput()">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                }
                @if (showDropdown()) {
                    <span class="material-symbols-outlined icon-blue">search</span>
                } @else {
                    <span class="material-symbols-outlined">stat_minus_1</span>
                }
            </div>
            @if (showDropdown()) {
                <ul class="dropdown-list" (mousedown)="onDropdownClick($event)" (scroll)="onScroll($event)">
                    @for (item of filteredItems(); track item[key()]) {
                        <li class="dropdown-item" (click)="selectItem(item)"
                            [ngClass]="{selected: item[key()] === searchTerm}">
                            {{ item[key()] }}
                        </li>
                    }
                </ul>
            }
        </div>
    `,
    styleUrl: './dropdown.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T> { //TODO otypowac, zmienic fonta inputa
    key: InputSignal<string> = input<string>('name');
    @Input() items!: WritableSignal<any[]>;
    @Output() selectedItem = new EventEmitter<any>();
    @Output() scrollEnd = new EventEmitter<boolean>();

    searchTerm: string = '';
    filteredItems: WritableSignal<any[]> = signal<any[]>([]);
    showDropdown: WritableSignal<boolean> = signal<boolean>(false);

    constructor() {
        effect(() => {
            if (this.items().length) {
                this.filteredItems.set(this.items()?.filter(item => (item[this.key()]).toLowerCase().includes(this.searchTerm.toLowerCase()))) ;
            }
        }, { allowSignalWrites: true });
    }

    onSearch(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.searchTerm = inputValue;
        this.filteredItems.set(this.items().filter(item =>
            (item[this.key()]).toLowerCase().includes(this.searchTerm.toLowerCase())));
    }

    selectItem(item: any) {
        if (item) {
            this.selectedItem.emit(item);
            this.searchTerm = item[this.key()];
            this.showDropdown.set(false);
            this.filteredItems.set(this.items());
        }

    }

    hideDropdown() {
        this.showDropdown.set(false);
    }

    onDropdownClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Clear the input and hide dropdown
    clearInput() {
        this.searchTerm = '';
        this.filteredItems.set(this.items());
        this.selectedItem.emit(null);
    }

    onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.scrollEnd.emit();
        }
    }

}

