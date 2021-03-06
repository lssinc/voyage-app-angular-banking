import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginFailed = false;
  isMobile = false;
  working = false;
  private watcher: Subscription;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private media: ObservableMedia,
    @Inject('Window') private window: any) { }

  ngOnInit() {
    this.initializeForm();
    this.isMobile = this.media.isActive('xs') || this.media.isActive('sm');
    this.watcher = this.media.subscribe((change: MediaChange) => {
      this.isMobile = change.mqAlias === 'xs' || change.mqAlias === 'sm';
    });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.working = true;
    const login = this.loginForm.value as Login;
    this.loginService.login(login)
      .subscribe(result => {
        this.working = false;
        this.window.location.href = `${environment.APP_HOME}`;
      }, error => {
        this.loginFailed = true;
        this.working = false;
      });
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
