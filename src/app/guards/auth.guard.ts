import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { map } from 'rxjs';

export const routerInjection = () => inject(Router);

export const authStateObs$ = () => inject(AuthService).authState$;

export const authGuard: CanActivateFn = () => {
    const router = routerInjection();
    const userservice = inject(UserService);
    return authStateObs$().pipe(
        map((user) => {
            const varUser = userservice.getUserEmail(user?.email as string);
            varUser.then(varData => {

                if (!varData?.isadmin) {
                router.navigateByUrl('/biblioteca');
                return false;
            }else{
                //router.navigateByUrl('/biblioadmin');
                return true;
            }
            })
            //router.navigateByUrl('/biblioadmin');           
            return true;
            
            
        })
    );
};

export const publicGuard: CanActivateFn = () => {
    const router = routerInjection();

    return authStateObs$().pipe(
        map((user) => {
            if (user) {
                router.navigateByUrl('/');
                return false;
            }
            return true;
        })
    );
};