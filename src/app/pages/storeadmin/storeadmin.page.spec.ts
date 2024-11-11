import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreadminPage } from './storeadmin.page';

describe('StoreadminPage', () => {
  let component: StoreadminPage;
  let fixture: ComponentFixture<StoreadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
