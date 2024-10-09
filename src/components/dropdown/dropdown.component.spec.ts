import { ComponentRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from './dropdown.component';

interface Item {
    id: number;
    name: string;
}
interface Item2 {
    ld: number;
    pk: string;
}

describe('DropdownComponent', () => {
    let component: DropdownComponent<Item>;
    let componentRef: ComponentRef<DropdownComponent<Item>>;
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
        componentRef = fixture.componentRef;
        componentRef.setInput('items', mockItems);
        componentRef.setInput('id', 'id');
        fixture.detectChanges();

        inputElement = fixture.debugElement.query(By.css('input'));
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display items with different structure', () => {
       const mockItems2: Item2[] = [
            { ld: 1, pk: 'Pikachu' },
            { ld: 2, pk: 'Bulbasaur' },
            { ld: 3, pk: 'Charmander' },
        ];
        componentRef.setInput('items', mockItems2)
        componentRef.setInput('id', 'ld');
        componentRef.setInput('key', 'pk');

        component.focus();
        fixture.detectChanges();

        const listItems = fixture.debugElement.queryAll(By.css('li'));
        expect(listItems.length).toBe(3);
        expect(listItems[0].nativeElement.textContent).toContain('Pikachu');
    });

    it('should display filtered items based on search term', () => {
        component.searchTerm.set('Pika');
        component.onSearch();
        component.focus();
        fixture.detectChanges();

        const listItems = fixture.debugElement.queryAll(By.css('li'));
        expect(listItems.length).toBe(1);
        expect(listItems[0].nativeElement.textContent).toContain('Pikachu');
    });

    it('should emit the selected item when an item is clicked', () => {
        spyOn(component.selectedItem, 'emit');

        component.searchTerm.set('Pikachu');
        component.onSearch();
        component.focus();
        fixture.detectChanges();

        const listItem = fixture.debugElement.query(By.css('li'));
        listItem.nativeElement.click();
        fixture.detectChanges();

        expect(component.selectedItem.emit).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should clear the input and emit null when the clear button is clicked', () => {
        spyOn(component.selectedItem, 'emit');

        component.searchTerm.set('Pikachu');
        component.onSearch();
        fixture.detectChanges();
        const clearButton = fixture.debugElement.query(By.css('.clear-button'));
        clearButton.nativeElement.click();
        fixture.detectChanges();

        expect(component.searchTerm()).toBe('');
        expect(component.selectedItem.emit).toHaveBeenCalledWith(null);
    });

    it('should show and hide the dropdown based on focus and blur events', () => {

        inputElement.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.showDropdown()).toBeTrue();

        inputElement.triggerEventHandler('blur', null);
        fixture.detectChanges();
        expect(component.showDropdown()).toBeFalse();
    });

    it('should emit scrollEnd when scrolled to the bottom of the dropdown list', () => {
        spyOn(component.scrollEnd, 'emit');

        const scrollEvent = { target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 } };
        component.onScroll(scrollEvent);
        fixture.detectChanges();

        expect(component.scrollEnd.emit).toHaveBeenCalledWith();
    });
});
