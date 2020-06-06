import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMiniComponent } from './book-mini.component';

describe('BookMiniComponent', () => {
  let component: BookMiniComponent;
  let fixture: ComponentFixture<BookMiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookMiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
