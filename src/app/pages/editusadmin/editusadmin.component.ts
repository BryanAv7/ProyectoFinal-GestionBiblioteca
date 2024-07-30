import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../domain/user';
import { Router, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderComponent } from '../../header/header.component';

export interface CreateForm {
  user: FormControl<string>;
  passwo: FormControl<string>;
  nombre: FormControl<string>;
  apellido: FormControl<string>;
  correo: FormControl<string>;
  celu: FormControl<string>;
  ubica: FormControl<string>;
  foto: FormControl<string>;
  socialUrl: FormControl<string>;
}

@Component({
  selector: 'app-editusadmin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatSlideToggleModule, FormsModule, HeaderComponent],
  templateUrl: './editusadmin.component.html',
  styleUrl: './editusadmin.component.scss'
})
export class EditusadminComponent {
  private eluserId = '';
  public posicion = true;

  constructor(private router: Router, private userservice: UserService, private formBuilder: NonNullableFormBuilder) { }

  get userId(): string {
    return this.eluserId;
  }

  @Input() set userId(value: string) {
    this.eluserId = value;
    this.setFormValues(this.eluserId);
  }

  form = this.formBuilder.group<CreateForm>({
    user: this.formBuilder.control('', Validators.required),
    passwo: this.formBuilder.control('', Validators.required),
    nombre: this.formBuilder.control('', Validators.required),
    apellido: this.formBuilder.control('', Validators.required),
    correo: this.formBuilder.control('', [Validators.required, Validators.email]),
    celu: this.formBuilder.control('', Validators.required),
    ubica: this.formBuilder.control('', Validators.required),
    foto: this.formBuilder.control(''),
    socialUrl: this.formBuilder.control('')
  });

  volver() {
    this.router.navigate(['/biblioteca']);
  }

  async editUser() {
    if (this.form.invalid) return;

    try {
      const user = this.form.value as User;
      user.isadmin = this.posicion;
      if (this.userId) {
        await this.userservice.updateUser(this.userId, user);
      } else {
        await this.userservice.addUser(user);
      }
      this.router.navigate(['/listausuario']);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async setFormValues(id: string) {
    try {
      const user = await this.userservice.getUser(id);
      if (!user) return;
      this.form.setValue({
        user: user.user || '',
        passwo: user.passwo || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        celu: user.celu || '',
        ubica: user.ubica || '',
        foto: user.foto || '',
        socialUrl: user.socialUrl || ''
      });
      this.posicion = user.isadmin ?? false;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
