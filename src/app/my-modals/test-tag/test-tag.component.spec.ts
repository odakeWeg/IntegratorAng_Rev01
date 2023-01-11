import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTagComponent } from './test-tag.component';

describe('TestTagComponent', () => {
  let component: TestTagComponent;
  let fixture: ComponentFixture<TestTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
