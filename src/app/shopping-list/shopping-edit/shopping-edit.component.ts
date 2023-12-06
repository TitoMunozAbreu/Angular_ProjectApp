import { 
  Component, 
  OnDestroy, 
  OnInit, 
  ViewChild 
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent  implements OnInit, OnDestroy{
  @ViewChild('f') ingredientForm: NgForm
  subscription: Subscription
  editMode = false
  editedItemIndex: number
  editedItem: Ingredient

  constructor(private slService: ShoppingListService){}
  
  ngOnInit(): void {
   this.subscription = this.slService.startedEditing.subscribe(
    (index: number) => {
      this.editedItemIndex = index
      this.editMode = true
      this.editedItem = this.slService.getIngredient(this.editedItemIndex)
      this.ingredientForm.control.patchValue({
        'name': this.editedItem.name,
        'amount': this.editedItem.amount
    })
    })
  }


  onSubmit(form: NgForm){
    //save the new values
    const newIngredient = new Ingredient(
      form.value.name,
      form.value.amount
    )
    if(this.editMode){
      //update ingredient in the service
      this.slService.updateIngredient(this.editedItemIndex, newIngredient)
    }else{
      //add ingredient to the shoping list
      this.slService.addIngredient(newIngredient)
    } 
    this.editMode = false
    //reset the form
    form.reset()
  }

  onClear(){
    //reset the form
    this.ingredientForm.reset()
    this.editMode = false
  }

  onDelete(){
    this.onClear()
    this.slService.deleteIngredient(this.editedItemIndex)
   
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }


}
