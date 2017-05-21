import { inject } from 'aurelia-framework';
import { Router } from "aurelia-router";
import * as Auth0Lock from "auth0/lock";


@inject(Router)
export class Authentication {

    constructor(router) {
        this.router = router;
        var self = this;
        this.lock = new Auth0Lock.default('{ -  YOUR VALUE HERE - }', '{ - YOUR APP SubDomain HERE - }.auth0.com');
        this.isAuthenticated = false;

        this.lock.on("authenticated", (authResult) => {
            self.lock.getProfile(authResult.idToken, (error, profile) => {

                console.log("Authentication => Auth0 lock onAuthenticated: " + profile.name);

                if (error) {
                    // Handle error
                    console.log("Authentication => Auth0 error: " + error);
                    return;
                }

                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                self.isAuthenticated = true;
                self.lock.hide();

                // redirect:
                console.log("Authentication => Auth0 Success: " + profile.name + " | NOW, REDIRECT to users");
                this.router.navigateToRoute('users');
            });
        });

        this.lock.on("authorization_error", (authError) => {
            console.log("Authentication => Auth0 ERROR: " + authError);
        })
    };
    login() {
        window.console.log("Authentication => Authentication.login() TRIGGERED!");
        this.lock.show();
    };
    logout() {
        console.log("Authentication => Auth0 Logout: " + localStorage.getItem('id_token'));

        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        this.isAuthenticated = false;

        // redirect:
        this.router.navigateToRoute('welcome');
    };
}