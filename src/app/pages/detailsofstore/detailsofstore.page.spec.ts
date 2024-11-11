import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsofstorePage } from './detailsofstore.page';

describe('DetailsofstorePage', () => {
  let component: DetailsofstorePage;
  let fixture: ComponentFixture<DetailsofstorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsofstorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
