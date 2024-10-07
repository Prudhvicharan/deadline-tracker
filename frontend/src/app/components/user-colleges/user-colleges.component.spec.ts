import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCollegesComponent } from './user-colleges.component';

describe('UserCollegesComponent', () => {
  let component: UserCollegesComponent;
  let fixture: ComponentFixture<UserCollegesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCollegesComponent]
    });
    fixture = TestBed.createComponent(UserCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
