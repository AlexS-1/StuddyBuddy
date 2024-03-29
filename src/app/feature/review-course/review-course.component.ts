import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth-service.service';
import { BackendDataService } from 'src/app/core/backend-data.service';
import { Evaluation } from 'src/app/models/evaluation';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-course',
  templateUrl: './review-course.component.html',
  styleUrls: ['./review-course.component.css']
})
export class ReviewCourseComponent {
  constructor(private route: ActivatedRoute, private backend: BackendDataService, private authService: AuthService) {

  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      const id = Number(params['id']);
      this.courseID = id.toString();
      /*DEPRICATED: Loading from JSON
      this.dataEntry = jsonData.find((entry) => entry.id === parseInt(id, 10));
      this.reviews = commentData.filter((entry) => entry.courseID === parseInt(id, 10));*/
    });
  }

  //Input from form
  courseID = "";
  courseName = "";
  currentRating = 0;
  review = "";

  //Output to form
  message = "";
  ratingVailidity = false;

  setRating(rating: number) {
    this.currentRating = rating;
    this.ratingVailidity = true;
  }
  
  async reviewCourse() {
    if (await this.authService.getCurrentUserName() == "") {
      this.message = "Please log in to review courses";
      return;
    }
    const evaluation: Evaluation = {
      username: await this.authService.getCurrentUserName(),
      date: new Date().toISOString().split('T')[0],
      review: this.review,
      rating: this.currentRating,
      courseID: Number(this.courseID)
    }
    this.message = await this.backend.addEvaluation(evaluation);
    this.courseID = "";
    this.courseName = "";
    this.review = "";
  }

}
