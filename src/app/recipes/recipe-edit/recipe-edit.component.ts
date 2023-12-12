import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  recipeForm: FormGroup
  id: number
  editMode = false
  
  constructor(private route: ActivatedRoute,
              private r: Router,
              private fb: FormBuilder,
              private recipeService: RecipeService){}

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        this.id = +param['id']
        this.editMode = param['id'] != null     
        this.initForm()
      }
    )


  }

  //Pre initialize the recipe form
  private initForm(){
    let recipeName = ''
    let recipeImagePath = ''
    let recipeDescription = ''
    let recipeIngredients = []

    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName = recipe.name
      recipeImagePath = recipe.imagePath
      recipeDescription = recipe.description
      //check if the recipe has ingredients
       if(recipe['ingredients']){
        for(let ing of recipe.ingredients){
          recipeIngredients.push(
            this.fb.group({
              name: [ing.name, [Validators.required]],
              amount: [ing.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]] 
            })
          )
        }
      }
    }
    
    this.recipeForm = this.fb.group({
      name: [recipeName, [Validators.required], [this.forbiddenNames.bind(this)]],
      description: [recipeDescription, [Validators.required]],
      imagePath: [recipeImagePath, [Validators.required]],
      ingredients: this.fb.array(recipeIngredients, Validators.required)
    })
  }

  onSubmit(){
    //check if editMode
    if(this.editMode){
      //update recipe
      this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    }else {
      //add new recipe
      this.recipeService.addRecipe(this.recipeForm.value)
    }
    //reset form
    this.recipeForm.reset()
    this.onCancel()
  }

  onCancel(){
    this.r.navigate(['../'], {relativeTo: this.route})
  }

  //add ingredients
  onAddIngredient(){
    (this.recipeForm.get('ingredients') as FormArray).push(
      this.fb.group({
        name: ['', [Validators.required]],
        amount: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]] 
      })
    )    
  }
  
  onDeleteIngredient(index: number){
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index)
  }

  isInvalid(field: string){
    return this.recipeForm.get(field)?.errors?.required
  }

  isInvalidFormGroup(field: string, index:number): boolean {
    const formGroup = this.controls[index] as FormGroup
    return !formGroup.get(field).valid && formGroup.get(field).touched
  }

  isInvalidArray(field: string, index:number): boolean {
    const formGroup = this.controls[index] as FormGroup
    return formGroup.get(field)?.errors?.required;
  
  }

  isInvalidPattern(field: string, index:number){
    const formGroup = this.controls[index] as FormGroup
    return formGroup.get(field)?.errors?.pattern
  }

  //async validation
  forbiddenNames(control: FormControl): Promise<any>|Observable<any> {
    const promise = new Promise((resolve, reject)=>{
        setTimeout(()=> {
            if(this.recipeService.recipeNameExists(control.value)){
            resolve({'nameExists': true})
          }else {
            resolve(null)
          }
        },1500)
    })
    return promise
}

//get ingredients control
get controls(){
  return (this.recipeForm.get('ingredients') as FormArray).controls
}




}
