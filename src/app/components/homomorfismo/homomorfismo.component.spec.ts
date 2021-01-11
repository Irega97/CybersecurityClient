import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomomorfismoComponent } from './homomorfismo.component';

describe('HomomorfismoComponent', () => {
  let component: HomomorfismoComponent;
  let fixture: ComponentFixture<HomomorfismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomomorfismoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomomorfismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
