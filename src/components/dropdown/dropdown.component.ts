import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    Output,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { BoldMatchingTextDirective } from '../../directives/bold-matching-text.directive';

@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        NgClass,
        BoldMatchingTextDirective,
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
                    <span
                        class="material-symbols-outlined">
                    {{ searchTerm ? 'search' : 'stat_1' }}
                </span>
                } @else {
                    <span class="material-symbols-outlined rotated-element">stat_1</span>
                }
            </div>
            @if (showDropdown()) {
                <ul
                    class="dropdown-list"
                    (mousedown)="onDropdownClick($event)"
                    (scroll)="onScroll($event)">
                    @for (item of filteredItems(); track item[id()]) {
                        <li
                            appBoldMatchingText
                            [searchTerm]="searchTerm"
                            [text]=" item[key()] "
                            class="dropdown-item"
                            (click)="selectItem(item)"
                            [ngClass]="{ selected: searchTerm.match(RegExp(item[key()], 'i'))}">
                        </li>
                    }
                </ul>
            }
        </div>
    `,
    styleUrl: './dropdown.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T extends Record<string, any>> {
    @ViewChild('input') input!: ElementRef;

    public items: InputSignal<T[]> = input<T[]>([]);
    public id: InputSignal<keyof T> = input<keyof T>('name');
    public key: InputSignal<keyof T> = input<keyof T>('name');

    @Output() selectedItem = new EventEmitter<T | null>();
    @Output() scrollEnd = new EventEmitter<boolean>();

    filteredItems: WritableSignal<T[]> = signal<T[]>([]);
    showDropdown: WritableSignal<boolean> = signal<boolean>(false);
    private readonly destroyRef = inject(DestroyRef);

    searchTerm: string = '';

    constructor() {
        toObservable(this.items).pipe(takeUntilDestroyed(this.destroyRef), tap(items => {
            if (items.length) {
                this.filteredItems.set(
                    items?.filter(item =>
                        (item[this.key()] as string).toLowerCase().includes(this.searchTerm.toLowerCase()),
                    ),
                );
            }
        })).subscribe();
    }

    onSearch(event: Event) {
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.filteredItems.set(
            this.items().filter(item =>
                (item[this.key()] as string).toLowerCase().includes(this.searchTerm.toLowerCase()),
            ),
        );
    }

    protected selectItem(item: T) {
        if (item) {
            this.selectedItem.emit(item);
            this.searchTerm = item[this.key()] as string;
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

    protected clearInput(event: Event) {
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

    protected focus() {
        this.showDropdown.set(true);
        this.input.nativeElement.focus();
    }

    protected readonly RegExp = RegExp;
}
