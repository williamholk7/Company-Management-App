import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeamOverlayComponent } from './new-team-overlay.component';

describe('NewTeamOverlayComponent', () => {
  let component: NewTeamOverlayComponent;
  let fixture: ComponentFixture<NewTeamOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTeamOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTeamOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
