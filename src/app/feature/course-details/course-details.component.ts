import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsonData from './../../../assets/content/course.json';
import commentData from './../../../assets/content/comments.json';
import { Course } from 'src/app/shared/course';
import { Evaluation } from 'src/app/shared/evaluation';
import { BackendDataService } from 'src/app/core/backend-data.service';
import { AuthService } from 'src/app/core/auth-service.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  dataEntry?: Course | undefined;
  reviews: Evaluation[] = [];

  constructor(private route: ActivatedRoute, private backend: BackendDataService, private authService: AuthService) {}

  async ngOnInit() {
    // Get information on loaded course
    this.route.params.subscribe(async (params) => {
      const id = params['id'];

      // DEPRICATED: Loading from JSON
      /*this.dataEntry = jsonData.find((entry) => entry.id === parseInt(id, 10));
      this.reviews = commentData.filter((entry) => entry.courseID === parseInt(id, 10));*/



      // Loading data from firebase backend
      console.log('loading course data');
      let docData = await this.backend.getCoursData(id);

      // get data from firebase DocumentData
      console.log('docData: ', docData);
      if(docData != null){
        this.dataEntry = docData['data']();
      }
    });
  }
}
