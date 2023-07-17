import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPen, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@services/auth.service';

import { RequestStatus } from '@models/request-status.model';
/* Para leer el query param */
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  // It is used as a state machine
  // It uses a literal type or union type for avoid error
  status: RequestStatus = 'init';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.queryParamMap.subscribe(params => {
      const email = params.get('email');
      if (email) {
        this.form.controls.email.setValue(email);
      }
    });
  }

  doLogin() {
    // First it make a form validation.
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      // If all is Ok then
      this.authService.login(email, password)
        .subscribe(
          {
            next: () => {
              this.status = 'success';
              this.router.navigate(['/app']);
            },
            error: (e) => {
              this.status = 'failed';
              /* console.error(this.status);
              console.log('Status code',e.status); */

            }
          }
        )

    } else {
      /* Marked as touch for avoid to receive null objects */
      this.form.markAllAsTouched();
    }
  }

}
