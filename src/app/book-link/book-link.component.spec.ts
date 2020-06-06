import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLinkComponent } from './book-link.component';

describe('BookLinkComponent', () => {
  let component: BookLinkComponent;
  let fixture: ComponentFixture<BookLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
