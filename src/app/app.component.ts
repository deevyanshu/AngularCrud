import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'AngularCrud';

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,private apiService:ApiService) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:"50%",
      
    }).afterClosed().subscribe(val=>{
      if(val==='save')
      {
        this.getAllProducts();
      }
    });
  }

  getAllProducts(){
    this.apiService.getProduct().subscribe(data=>{
      this.dataSource=new MatTableDataSource(data);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    },error=>console.log(error));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(row:any)
  {
    this.dialog.open(DialogComponent,{
      width:"50%",
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update')
      {
        this.getAllProducts();
      }
    })
    
  }

  delete(id:number)
  {
    this.apiService.deleteProduct(id).subscribe(data=>{
      alert("product deleted succesfully");
      this.getAllProducts();
    })
  }

}
