import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonRepudiationComponent } from './non-repudiation.component';

describe('NonRepudiationComponent', () => {
  let component: NonRepudiationComponent;
  let fixture: ComponentFixture<NonRepudiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonRepudiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRepudiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
