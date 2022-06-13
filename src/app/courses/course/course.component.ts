import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
} from "rxjs/operators";
import { merge, fromEvent, Observable } from "rxjs";
import { LessonsDataSource } from "../services/lessons.datasource";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { PageQuery } from "../course.actions";
import { selectLessonsLoading } from "../course.selectors";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;

  dataSource: LessonsDataSource;

  displayedColumns = ["seqNo", "description", "duration"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];

    this.loading$ = this.store.select(selectLessonsLoading);

    this.dataSource = new LessonsDataSource(this.store);

    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 3,
    };

    this.dataSource.loadLessons(this.course.id, initialPage);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadLessonsPage())).subscribe();
  }

  loadLessonsPage() {
    const page: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
    };

    this.dataSource.loadLessons(this.course.id, page);
  }
}
