import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Credential } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../../domain/user';

interface SignUpForm {
  username: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  phone: FormControl<string | null>;
  location: FormControl<string | null>;
  socialUrl: FormControl<string | null>;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  hide = true;

  user: User = new User();

  formBuilder = inject(FormBuilder);

  form: FormGroup<SignUpForm> = this.formBuilder.group<SignUpForm>({
    username: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    firstName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    phone: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    location: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    socialUrl: this.formBuilder.control('')
  });

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  async signUp(): Promise<void> {
    if (this.form.invalid) return;

    const credential: Credential = {
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    try {
      await this.authService.signUpWithEmailAndPassword(credential);
      this.user.correo = this.form.value.email!;
      this.user.user = this.form.value.username!;
      this.user.nombre = this.form.value.firstName!;
      this.user.apellido = this.form.value.lastName!;
      this.user.passwo = this.form.value.password!;
      this.user.celu = this.form.value.phone!;
      this.user.ubica = this.form.value.location!;
      this.user.socialUrl = this.form.value.socialUrl!;
      
      await this.userService.addUser(this.user);
      
      alert("Registro Completado. Inició sesión exitosamente 😀");
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error(error);
      alert("Error en el registro. Por favor, inténtelo de nuevo.");
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this.authService.signInWithGoogleProvider();
      this.user.user = result.user.displayName || '';
      this.user.nombre = result.user.displayName || '';
      this.user.apellido = result.user.displayName || '';
      this.user.correo = result.user.email || '';
      this.user.passwo = result.user.tenantId || '';
      this.user.foto = result.user.photoURL || '';

      await this.userService.addUser(this.user);

      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error(error);
    }
  }

  volver() {
    this.router.navigate(['/inicio']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  irRegresar() {
    this.router.navigate(['/login']);
  }
}