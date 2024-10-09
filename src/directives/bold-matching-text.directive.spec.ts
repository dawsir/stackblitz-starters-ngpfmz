import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BoldMatchingTextDirective } from './bold-matching-text.directive';
import { By } from '@angular/platform-browser';

@Component({
    template: `
        <p appBoldMatchingText [searchTerm]="searchTerm" [text]="text"></p>
    `,
    standalone: true,
    imports: [BoldMatchingTextDirective],
})
class TestComponent {
    searchTerm = '';
    text = 'Angular is a powerful framework';
}

describe('BoldMatchingTextDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent],
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    it('should bold the matching text when searchTerm is provided', () => {
        component.searchTerm = 'Angular';
        fixture.detectChanges();

        const p: HTMLElement = fixture.debugElement.query(By.directive(BoldMatchingTextDirective)).nativeElement;


        expect(p.innerHTML).toContain('<strong>Angular</strong>');
    });

    it('should not change the text if no searchTerm is provided', () => {
        component.searchTerm = '';
        fixture.detectChanges();

        const p: HTMLElement = fixture.debugElement.query(By.directive(BoldMatchingTextDirective)).nativeElement;


        expect(p.textContent).toBe('Angular is a powerful framework');
    });

    it('should not bold text when the searchTerm does not match', () => {
        component.searchTerm = 'React';
        fixture.detectChanges();

        const p: HTMLElement = fixture.debugElement.query(By.directive(BoldMatchingTextDirective)).nativeElement;


        expect(p.innerHTML).not.toContain('<strong>');
        expect(p.textContent).toBe('Angular is a powerful framework');
    });

    it('should handle empty text gracefully', () => {
        component.text = '';
        component.searchTerm = 'Angular';
        fixture.detectChanges();

        const p: HTMLElement = fixture.debugElement.query(By.directive(BoldMatchingTextDirective)).nativeElement;


        expect(p.textContent).toBe('');
        expect(p.innerHTML).not.toContain('<strong>');
    });
});
