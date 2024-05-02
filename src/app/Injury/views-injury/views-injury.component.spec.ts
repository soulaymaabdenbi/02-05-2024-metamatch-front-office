import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsInjuryComponent } from './views-injury.component';

describe('ViewsInjuryComponent', () => {
  let component: ViewsInjuryComponent;
  let fixture: ComponentFixture<ViewsInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsInjuryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
