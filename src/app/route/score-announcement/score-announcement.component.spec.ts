import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreAnnouncementComponent } from './score-announcement.component';

describe('ScoreAnnouncementComponent', () => {
  let component: ScoreAnnouncementComponent;
  let fixture: ComponentFixture<ScoreAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoreAnnouncementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
