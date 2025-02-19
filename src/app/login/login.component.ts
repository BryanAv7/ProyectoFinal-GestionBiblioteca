import { Component, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Credential } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { User } from '../../domain/user';
import { UserService } from '../services/user.service';


interface LogInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export type Provider = 'google';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: User = new User();
  users: any;
  isLogin = false;

  correo: string = '';
  nombre: string = '';
  admin: boolean = false;

  formBuilder = inject(FormBuilder);

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private header: HeaderComponent) { }

  form: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Este campo es requerido'
        : 'Introduzca un correo válido';
    }

    return false;
  }

  async logIn(): Promise<void> {
    if (this.form.invalid) return;

    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    try {
      await this.authService.logInWithEmailAndPassword(credential);
      alert("Inició sesión exitosamente 😀");
      //const data = this.authService.getCurrentUser();
      const data = this.userService.getUserEmail(credential.email);
      console.log("---");
      console.log(data);
      this.router.navigateByUrl('/biblioadmin');
    } catch (error) {
      console.error(error);
    }
  }

  providerAction(provider: Provider): void {
    if (provider === 'google') {
      this.signUpWithGoogle();
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
        const result = await this.authService.signInWithGoogleProvider();
        console.log(result);
        const email = result.user.email || '';
        await this.changeQuery(email);

        if (this.user.isadmin) {
            this.header.pasarNeim(this.nombre);
            this.router.navigateByUrl('/biblioadmin');
        } else {
            this.header.pasarNeim(this.nombre);
            this.router.navigateByUrl('/biblioteca');
        }
    } catch (error) {
        console.log(error);
    }
}


async changeQuery(email: string) {
  console.log(email);
  try {
      await this.userService.searchUserUnico(email).then(data => {
          this.users = data.docs.map((doc: any) => {
              return {
                  id: doc.id,
                  ...doc.data()
              };
          });
          console.log('usuarios', this.users);
          this.user = this.users[0];
          this.nombre = this.user.nombre;
          this.correo = this.user.correo;
          console.log('usuario', this.user);
      });
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

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}