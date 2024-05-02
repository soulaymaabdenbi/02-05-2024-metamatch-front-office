import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedInjuryComponent } from './archived-injury.component';

describe('ArchivedInjuryComponent', () => {
  let component: ArchivedInjuryComponent;
  let fixture: ComponentFixture<ArchivedInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedInjuryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
