import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    EventEmitter,
    input,
    Input,
    InputSignal,
    Output,
    WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
    ],
    template: `
        <div class="dropdown-wrapper">
            <label for="select">Favourite character</label>
            <div class="input-wrapper">
                <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (focus)="showDropdown$.next(true)"
                    (blur)="hideDropdown()"
                    (input)="onSearch($event)"
                    placeholder="Choose your favourite..."
                    class="dropdown-input"
                />
                @if (searchTerm) {
                    <button class="clear-button" (click)="clearInput()">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                }
                @if (showDropdown$ | async) {
                    <span class="material-symbols-outlined">stat_minus_1</span>
                } @else {
                    <span class="material-symbols-outlined icon-blue">search</span>
                }

            </div>
            @if (showDropdown$ | async) {
                <ul class="dropdown-list" (mousedown)="onDropdownClick($event)" (scroll)="onScroll($event)">
                    @for (item of filteredItems; track item[key()]) {
                        <li (click)="selectItem(item)" class="dropdown-item">
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
export class DropdownComponent<T> { //TODO otypowac
    key: InputSignal<string> = input<string>('name');
    @Input() items!: WritableSignal<any[]>;
    @Output() selectedItem = new EventEmitter<any>();
    @Output() scrollEnd = new EventEmitter<boolean>();

    searchTerm: string = '';
    filteredItems: any[] = [];
    showDropdown$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {
        effect(() => {
            if (this.items().length) {
                console.log(this.items().length);
                this.filteredItems = this.items()?.filter(item => (item[this.key()]).toLowerCase().includes(this.searchTerm.toLowerCase()));
            }
        });
    }

    onSearch(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.searchTerm = inputValue;
        this.filteredItems = this.items().filter(item =>
            (item[this.key()]).toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    selectItem(item: any) {
        console.log('select', item);
        if (item) {
            this.selectedItem.emit(item);
            this.searchTerm = item[this.key()];
            this.filteredItems = [];
            this.showDropdown$.next(false);
        }

    }

    hideDropdown() {
        this.showDropdown$.next(false);
    }

    onDropdownClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Clear the input and hide dropdown
    clearInput() {
        this.searchTerm = '';
        this.filteredItems = this.items();
        this.showDropdown$.next(false);
    }

    onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.scrollEnd.emit();
        }
    }

}

