import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { CourseActions, CourseActionTypes } from "./course.actions";
import { Lesson } from "./model/lesson";

export interface LessonsState extends EntityState<Lesson> {
  loading: boolean;
}

export const sortByCourseThenBySeqNumber = (l1: Lesson, l2: Lesson) => {
  if (l1.courseId !== l2.courseId) return l1.courseId - l2.courseId;
  else return l1.seqNo - l2.seqNo;
};

export const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
  sortComparer: sortByCourseThenBySeqNumber,
});

export const initialLessonsState = adapter.getInitialState({ loading: false });

export const lessonsReducer = (
  state: LessonsState = initialLessonsState,
  action: CourseActions
): LessonsState => {
  switch (action.type) {
    case CourseActionTypes.LessonsPageCancelled:
      return { ...state, loading: false };
    case CourseActionTypes.LessonsPageRequested:
      return { ...state, loading: true };
    case CourseActionTypes.LessonsPageLoaded:
      return adapter.addMany(action.payload.lessons, {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
