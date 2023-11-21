import { 
  Component, 
  DoCheck, 
  ElementRef, 
  EventEmitter, 
  Input, 
  Output, 
  ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent  {
  @ViewChild("nameInput" , {static:false}) nameInput: ElementRef<HTMLInputElement>;
  @ViewChild("amountInput" , {static:false}) amountInput: ElementRef;

 
  constructor(private slService: ShoppingListService){}

  add(){
    const ingName = this.nameInput.nativeElement.value;
    const ingAmount = this.amountInput.nativeElement.value;
    const newIngredient = new Ingredient(ingName,ingAmount);
    this.slService.addIngredient(newIngredient);
  }





}
