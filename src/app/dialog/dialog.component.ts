import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList= ["Brand new","Second hand","Refurbished"];
  productForm!:FormGroup;
  actionBtn:string="save";

  constructor(private formBuilder:FormBuilder,private api:ApiService,@Inject(MAT_DIALOG_DATA)public edit:any,private dialogref:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm=this.formBuilder.group({
      productName:['',Validators.required],
      category:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required]
    });

    if(this.edit)
    {
      this.actionBtn="update";
      this.productForm.controls['productName'].setValue(this.edit.productName);
      this.productForm.controls['category'].setValue(this.edit.category);
      this.productForm.controls['freshness'].setValue(this.edit.freshness);
      this.productForm.controls['date'].setValue(this.edit.date);
      this.productForm.controls['price'].setValue(this.edit.price);
      this.productForm.controls['comment'].setValue(this.edit.comment);
    }
  }

  addProduct(){
    if(!this.edit)
    {
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value).subscribe(data=>{
          alert("product added successfully");
          this.productForm.reset();
          this.dialogref.close('save');
        },error=>alert("error"))
      }else
      {
        alert("fill all details");
      }
    }else
    {
      this.update();
    }
  }

  update()
  {
    this.api.updateProduct(this.productForm.value,this.edit.id).subscribe(data=>{
      alert("product updated successfully")
      this.productForm.reset();
      this.dialogref.close('update');
    },error=>alert("error"))
  }

}
