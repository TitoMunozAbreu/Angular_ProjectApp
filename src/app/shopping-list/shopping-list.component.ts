import { Component, ViewChild, ElementRef, OnInit, DoCheck, EventEmitter, Output} from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient [];

  constructor(private slService: ShoppingListService){}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngridients();
    
    this.slService.ingredientsChanged
    .subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }





}
