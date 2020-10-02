import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute){ }
  ngOnInit(){ }

  reRoute(){
    console.log(this.route.snapshot['_routerState'].url);
    this.router.navigate(['configstocks'], {relativeTo: this.route});
  }
}
