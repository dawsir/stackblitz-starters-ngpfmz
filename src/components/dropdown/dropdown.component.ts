import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect, ElementRef,
    EventEmitter,
    input,
    Input,
    InputSignal,
    Output, signal, ViewChild,
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
            <label for="select">Favourite character</label>
            <div class="input-wrapper" (click)="focus()">
                <input
                    #input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (click)="showDropdown.set(true)"
                    (blur)="hideDropdown()"
                    (input)="onSearch($event)"
                    placeholder="Choose your favourite..."
                />
                @if (searchTerm) {
                    <button class="clear-button" (click)="clearInput($event)">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                }
                @if (showDropdown()) {
                    @if (searchTerm) {
                        <span class="material-symbols-outlined icon-blue">search</span>
                    } @else {
                        <span class="material-symbols-outlined">keyboard_arrow_up</span>

                    }
                } @else {
                    <span class="material-symbols-outlined">keyboard_arrow_down</span>
                }
            </div>
            @if (showDropdown()) {
                <ul class="dropdown-list" (mousedown)="onDropdownClick($event)" (scroll)="onScroll($event)">
                    @for (item of filteredItems(); track item[id()]) {
                        <li class="dropdown-item" (click)="selectItem(item)"
                            [ngClass]="{selected: item[id()] === searchTerm}">
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
export class DropdownComponent {
    @ViewChild('input') input!: ElementRef;
    protected id: InputSignal<string> = input<string>('name');
    protected key: InputSignal<string> = input<string>('name');
    filteredItems: WritableSignal<any[]> = signal<any[]>([]);
    showDropdown: WritableSignal<boolean> = signal<boolean>(false);

    @Input() items!: WritableSignal<any[]>;
    @Output() selectedItem = new EventEmitter<any>();
    @Output() scrollEnd = new EventEmitter<boolean>();

    searchTerm: string = '';


    constructor() {
        effect(() => {
            if (this.items().length) {
                this.filteredItems.set(this.items()?.filter(item => (item[this.id()]).toLowerCase().includes(this.searchTerm.toLowerCase())));
            }
        }, { allowSignalWrites: true });
    }

    onSearch(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.searchTerm = inputValue;
        this.filteredItems.set(this.items().filter(item =>
            (item[this.id()]).toLowerCase().includes(this.searchTerm.toLowerCase())));
    }

    selectItem(item: any) {
        if (item) {
            this.selectedItem.emit(item);
            this.searchTerm = item[this.key()];
            this.showDropdown.set(false);
            this.filteredItems.set(this.items());
        }

    }

    protected hideDropdown() {
        this.showDropdown.set(false);
    }

    protected onDropdownClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Clear the input and hide dropdown
    clearInput(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.searchTerm = '';
        this.filteredItems.set(this.items());
        this.selectedItem.emit(null);
        this.focus();
    }

    onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.scrollEnd.emit();
        }
    }

    focus() {
        this.showDropdown.set(true);
        this.input.nativeElement.focus();
    }

}

