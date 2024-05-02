import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInjuryComponent } from './home-injury.component';

describe('HomeInjuryComponent', () => {
  let component: HomeInjuryComponent;
  let fixture: ComponentFixture<HomeInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeInjuryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
