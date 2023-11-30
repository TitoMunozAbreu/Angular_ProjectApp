import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
    
    private recipes: Recipe [] = [
        new Recipe("Chicken Grill", 
        "This easy grilled chicken and vegetables recipe takes 30 minutes to make and is a delicious, healthy ", 
        "https://simply-delicious-food.com/wp-content/uploads/2019/04/30-minute-grilled-chicken-and-vegetables-3.jpg",
        [
            new Ingredient('chicken', 2),
            new Ingredient('green-pepper', 3),
            new Ingredient('red-pepper', 2)
        ]),

        new Recipe("Beer-battered fish with mushy peas", 
        "Make this pub classic of beer-battered fish with mushy peas from scratch in your own kitchen ", 
        "https://realfood.tesco.com/media/images/1400x919-Fish-and-chips-1b85df35-ab62-4d9e-90c6-e8a00db893ac-0-1400x919.jpg",
        [
            new Ingredient('fish', 1),
            new Ingredient('peas', 2),
            new Ingredient('beer', 1)
        ])
        
    ];
    
    constructor(private slService: ShoppingListService){}

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient []){
        this.slService.addIngredients(ingredients);
    }
    
}