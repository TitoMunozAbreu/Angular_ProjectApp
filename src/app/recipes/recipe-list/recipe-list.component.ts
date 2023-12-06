import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  subscription: Subscription
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe [];

  constructor(private recipeService: RecipeService){}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes()
    //subscribe to any change in the list
    this.subscription = this.recipeService.recipeChanged.subscribe(
      (r: Recipe[]) => {
        this.recipes = r
      }
    );
  }
  onRecipe(recipe:Recipe){
      this.recipeWasSelected.emit(recipe);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
