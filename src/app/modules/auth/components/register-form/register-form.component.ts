import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';

import { AuthService } from '@services/auth.service';

import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  //New form for email validation
  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });



  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showPasswordConfirm = false;
  errorApi = '';
  availabelEmail = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,

  ) { }

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      console.log(name, email, password);
      this.authService.register(name, email, password)
        .subscribe(
          {
            next: () => {
              this.status = 'success';
              this.router.navigate(['/login']);
            },
            error: (error) => {
              this.status = 'failed';
              this.errorApi = error.error.message;
              //console.log(this.errorApi);
            }
          }
        )
    } else {
      this.form.markAllAsTouched();
    }
  }
  validateUser() {
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email } = this.formUser.getRawValue();
      //isAvailable allways sens 201 value
      this.authService.isAvailable(email)
        .subscribe(
          {
            next: (rta) => {
              this.status = 'success';
              if (rta.isAvailable === true) {
                this.availabelEmail = true;
                this.form.controls.email.setValue(email);
              } else {
                this.router.navigate(['/login'], {
                  queryParams: { email }
                });
              }
            },
            error: (error) => {
              this.status = 'failed';
              this.errorApi = error.error.message;
              //console.log(this.errorApi);
            }
          }
        )

    } else {
      this.formUser.markAllAsTouched()
        ;
    }

  }
}
