import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";


import { DataStorageService } from "../shared/data-storage.service";


export const recipesResolver: ResolveFn<Recipe[]> = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ) => {
        return inject(DataStorageService).fetchData()
    }
    
