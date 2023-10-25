import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTasksComponent } from './sidebar-tasks.component';

describe('SidebarTasksComponent', () => {
  let component: SidebarTasksComponent;
  let fixture: ComponentFixture<SidebarTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarTasksComponent]
    });
    fixture = TestBed.createComponent(SidebarTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
