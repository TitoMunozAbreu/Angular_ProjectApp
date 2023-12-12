import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Subject, map, tap } from "rxjs";
import { Recipe } from "../recipes/recipe.model";

@Injectable({providedIn:"root"})
export class DataStorageService {
    dataChanged = new Subject<boolean>
    private baseURL = 'https://papaya-api-v1-default-rtdb.firebaseio.com'

    constructor(private http: HttpClient,
                private recipeService: RecipeService){}

    storageData(){
      this.http.put(`${this.baseURL}/recipe.json`, 
                        this.recipeService.getRecipes(),
                        {
                            observe: 'response'
                        })
                .subscribe(response => {
                    console.log('saving data');                    
                    this.dataChanged.next(response.ok)
                })
    }

    fetchData(){
        return this.http.get<Recipe[]>(`${this.baseURL}/recipe.json`)
                        .pipe(
                            map(recipe => {
                                return recipe.map(recipe => {
                                    return {
                                        ...recipe, 
                                        ingredients: recipe.ingredients ? recipe.ingredients : []
                                    }
                                })
                            }),
                            tap(recipe => {
                                this.recipeService.setRecipes(recipe)
                            })
                        )        
    }

}