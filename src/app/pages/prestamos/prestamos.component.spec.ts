import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoComponent } from './prestamos.component';

describe('PrestamosComponent', () => {
  let component: PrestamoComponent;
  let fixture: ComponentFixture<PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
