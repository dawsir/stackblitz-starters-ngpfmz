import { ComponentRef, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from './dropdown.component';

interface Item {
    id: number;
    name: string;
}

describe('DropdownComponent', () => {
    let component: DropdownComponent<Item>;
    let componentRef: ComponentRef<DropdownComponent<Item>>
    let fixture: ComponentFixture<DropdownComponent<Item>>;
    let inputElement: DebugElement;
    let mockItems: Item[];

    beforeEach(async () => {
        mockItems = [
            { id: 1, name: 'Pikachu' },
            { id: 2, name: 'Bulbasaur' },
            { id: 3, name: 'Charmander' },
        ];

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule, DropdownComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DropdownComponent<Item>);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef
        componentRef.setInput('items', mockItems)
        fixture.detectChanges(); // Trigger change detection

        inputElement = fixture.debugElement.query(By.css('input')); // Grab the input element for further testing
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display filtered items based on search term', () => {
        component.searchTerm = 'Pika'; // Set the search term
        component.onSearch(new Event('input')); // Simulate the input event
        fixture.detectChanges(); // Trigger change detection

        const listItems = fixture.debugElement.queryAll(By.css('li')); // Find all <li> elements
        expect(listItems.length).toBe(1); // Expect only one item to match ('Pikachu')
        expect(listItems[0].nativeElement.textContent).toContain('Pikachu');
    });

    it('should emit the selected item when an item is clicked', () => {
        spyOn(component.selectedItem, 'emit'); // Spy on the selectedItem event emitter
        component.searchTerm = 'Pikachu'; // Set search term to match one item
        component.onSearch(new Event('input')); // Trigger input search
        fixture.detectChanges(); // Detect changes

        const listItem = fixture.debugElement.query(By.css('li')); // Grab the first <li>
        listItem.nativeElement.click(); // Simulate clicking the item
        fixture.detectChanges(); // Trigger change detection

        expect(component.selectedItem.emit).toHaveBeenCalledWith(mockItems[0]); // Ensure the right item is emitted
    });

    it('should clear the input and emit null when the clear button is clicked', () => {
        spyOn(component.selectedItem, 'emit'); // Spy on the selectedItem emitter

        // Set search term and filter items
        component.searchTerm = 'Pikachu';
        component.onSearch(new Event('input'));
        fixture.detectChanges();

        const clearButton = fixture.debugElement.query(By.css('.clear-button')); // Get the clear button
        clearButton.nativeElement.click(); // Simulate clicking the clear button
        fixture.detectChanges();

        expect(component.searchTerm).toBe(''); // Expect the search term to be cleared
        expect(component.selectedItem.emit).toHaveBeenCalledWith(null); // Expect null to be emitted
    });

    it('should show and hide the dropdown based on focus and blur events', () => {
        // Simulate clicking the input (show the dropdown)
        inputElement.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.showDropdown()).toBeTrue(); // Dropdown should be shown

        // Simulate blur event (hide the dropdown)
        inputElement.triggerEventHandler('blur', null);
        fixture.detectChanges();
        expect(component.showDropdown()).toBeFalse(); // Dropdown should be hidden
    });

    it('should emit scrollEnd when scrolled to the bottom of the dropdown list', () => {
        spyOn(component.scrollEnd, 'emit'); // Spy on the scrollEnd emitter

        // Simulate the scroll event at the bottom of the list
        const scrollEvent = { target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 } };
        component.onScroll(scrollEvent);
        fixture.detectChanges();

        expect(component.scrollEnd.emit).toHaveBeenCalledWith(); // Expect scrollEnd event to be emitted
    });
});
