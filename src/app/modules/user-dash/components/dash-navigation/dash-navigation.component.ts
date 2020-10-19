import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dash-navigation',
  templateUrl: './dash-navigation.component.html',
  styleUrls: ['./dash-navigation.component.css']
})
export class DashNavigationComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }
  imagePaths = [
    '../../../../../assets/dash-images/custom.png',
    '../../../../../assets/dash-images/compare-chart.jpg', 
    '../../../../../assets/dash-images/stocks-graph.jpg'
  ];
  styles = [
    {
      'background-image': `url(${this.imagePaths[0]})`
    },
    {
      'background-image': `url(${this.imagePaths[1]})`
    },
    {
      'background-image': `url(${this.imagePaths[2]})`
    }
  ];

  navToCompare(){
    console.log(this.router.url)
    this.router.navigate(['comparelanding'], {relativeTo: this.route});
  }

}
