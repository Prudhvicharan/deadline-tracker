import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCollegesComponent } from './my-colleges.component';

describe('MyCollegesComponent', () => {
  let component: MyCollegesComponent;
  let fixture: ComponentFixture<MyCollegesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCollegesComponent]
    });
    fixture = TestBed.createComponent(MyCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
