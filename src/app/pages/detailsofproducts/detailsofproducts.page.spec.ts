import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsofproductsPage } from './detailsofproducts.page';

describe('DetailsofproductsPage', () => {
  let component: DetailsofproductsPage;
  let fixture: ComponentFixture<DetailsofproductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsofproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
