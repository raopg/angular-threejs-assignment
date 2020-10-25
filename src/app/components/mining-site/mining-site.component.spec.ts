import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningSiteComponent } from './mining-site.component';

describe('MiningSiteComponent', () => {
  let component: MiningSiteComponent;
  let fixture: ComponentFixture<MiningSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiningSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
