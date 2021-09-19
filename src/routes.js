import React, { useEffect } from 'react'
import * as actions from "./store/actions/index";
import { connect } from "react-redux"
import CourseForm from "./containers/Forms/CourseForm/CourseForm";
import Aux from "./hoc/Auxiliary/Auxiliary";
import Accordion from "./components/UI/Accordion/Accordion";
import { Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const GradeTestForm = React.lazy(() => import("./containers/Forms/GradeTestForm/GradeTestForm"));
const StudentDetail = React.lazy(() => import("./containers/InstructorPanel/StudentDetail/StudentDetail"));
const GradePanel = React.lazy(() => import("./containers/InstructorPanel/GradeDetail/GradeDetail"));
const LessonForm = React.lazy(() => import("./containers/Forms/LessonForm/LessonForm"));
const TestForm = React.lazy(() => import("./containers/Forms/TestForm/TestForm"));
const Questions = React.lazy(() => import("./containers/InstructorPanel/Questions/Questions"));
const InstructorTests = React.lazy(() => import("./containers/InstructorPanel/Tests/Tests"));
const InstructorModules = React.lazy(() => import("./containers/InstructorPanel/Category/Category"));

const CompletedTests = React.lazy(() => import("./containers/StudentPanel/Tests/CompletedTests"));
const IncompleteTests = React.lazy(() => import("./containers/StudentPanel/Tests/IncompleteTests"));
const ProgressReport = React.lazy(() => import("./containers/Common/ProgressReport/ProgressReport"));
const Lesson = React.lazy(() => import("./containers/InstructorPanel/Lessons/Lesson/Lesson"));

const Lessons = React.lazy(() => import("./containers/InstructorPanel/Lessons/Lessons"));
const InstructorResources = React.lazy(() => import("./containers/InstructorPanel/Resources/Resources"));
const StudentResources = React.lazy(() => import("./containers/StudentPanel/Resources/Resources"));
const Contacts = React.lazy(() => import("./containers/Common/Chat/Contacts"));
const Chat = React.lazy(() => import("./containers/Common/Chat/Chat"));
const StudentModules = React.lazy(() => import("./containers/StudentPanel/Modules/Modules"));

const Authentication = React.lazy(() => import("./containers/Forms/AuthenticationForm/AuthenticationForm"));
const Logout = React.lazy(() => import("./containers/Authentication/Logout/Logout"));
const PasswordReset = React.lazy(() => import("./containers/Authentication/PasswordReset/PasswordReset"));
const AccountVerification = React.lazy(() => import("./containers/Authentication/AccountVerification/AccountVerification"));
const Account = React.lazy(() => import("./containers/Account/Account"));
const Configuration = React.lazy(() => import("./containers/Configuration/Configuration"));
const Users = React.lazy(() => import("./containers/InstructorPanel/Users/Users"));
const Transcript = React.lazy(() => import("./containers/StudentPanel/Transcript/Transcript"));
const Test = React.lazy(() => import("./containers/StudentPanel/Test/Test"));

// const CourseForm = React.lazy(() => import("./containers/Forms/CourseForm/CourseForm"));
const CourseCards = React.lazy(() => import("./containers/Common/CourseCards/CourseCards"));

const Gradebook = React.lazy(() => import("./containers/Common/ModalContent/Gradebook/Gradebook"));
const UserSummary = React.lazy(() => import("./containers/Common/ModalContent/UserSummary/UserSummary"));
const ReviewTest = React.lazy(() => import("./containers/StudentPanel/ReviewTest/ReviewTest"));
const Question = React.lazy(() => import("./containers/Forms/QuestionForm/QuestionForm"));
const EnrollmentStudentConfirmation = React.lazy(() => import("./containers/Common/ModalContent/Confirmations/EnrollmentCourseConfirmation/EnrollmentCourseConfirmation"));
const TakeTestConfirmation = React.lazy(() => import("./containers/Common/ModalContent/Confirmations/TakeTestConfirmation/TakeTestConfirmation"));

//component: Test
const mapDispatchToProps = (dispatch) => {
    return {
        fetchQuestionBank: (courseId, token) =>
            dispatch(actions.fetchQuestionBankStart(courseId, token)),
    }
}

const mapStateToProps = (state) => {
    return {
        course: state.common.selectedCourse,
        token: state.authentication.token,
    }
}

const QuestionBank = connect(mapStateToProps, mapDispatchToProps)(({ course, fetchQuestionBank }) => {
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetchQuestionBank(course, token)
    }, []);
    const {t} = useTranslation("common");
    return (
        <Aux>
            <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.questions")}</Typography>
            {[
                "Multiple-choice questions",
                "Essay questions",
                "Speaking questions",
                "Fill-in-the-blanks questions",
            ].map((questionType, index) => (
                <Accordion key={questionType} index={index} summary={questionType}>
                    <Questions questionType={questionType} />
                </Accordion>
            ))}
        </Aux>
    )
})






export const getRoutes = (courseId, lessonId, testId, isTestInSession, isLessonsAllowed) => {

    return [
        {
            path: "/student-panel/course/:courseId/test-in-session",
            exact: true,
            component: Test,
            isTest: true,
        },
        {
            path: "/verify-account/:accountType/:token",
            exact: true,
            component: AccountVerification,
            isTokenRequired: false,
        },
        {
            path: "/reset/:accountType/:token",
            exact: true,
            component: PasswordReset,
            isTokenRequired: false,
        },
        {
            path: "/users/instructors",
            exact: true,
            component: Users,
            isAdminRoute: true,
            tabs: [{ name: 'Instructors', route: '/users/instructors' }, { name: 'Students', route: '/users/students' }],
            tab: 0,
        },
        {
            path: "/users/instructors/:instructorId",
            exact: true,
            component: UserSummary,
            isAdminRoute: true,
            tabs: [{ name: 'Instructors', route: '/users/instructors' }, { name: 'Students', route: '/users/students' }],
            tab: 0,
        },
        {
            path: "/users/students",
            exact: true,
            component: Users,
            isAdminRoute: true,
            isStudent: true,
            tabs: [{ name: 'Instructors', route: '/users/instructors' }, { name: 'Students', route: '/users/students' }],
            tab: 1,
        },
        {
            path: "/users/students/:studentId",
            exact: true,
            component: UserSummary,
            isAdminRoute: true,
            isStudent: true,
            tabs: [{ name: 'Instructors', route: '/users/instructors' }, { name: 'Students', route: '/users/students' }],
            tab: 1,
        },
        {
            path: "/transcript",
            exact: true,
            component: Transcript,
            isStudentRoute: true,
        },
        {
            path: "/account",
            exact: true,
            component: Account,
        },
        {
            path: "/configuration",
            exact: true,
            component: Configuration,
        },
        {
            path: "/instructor-panel/courses",
            exact: true,
            component: CourseCards,
            tabs: [{ name: 'Courses', route: '/instructor-panel/courses' }, { name: 'New course', route: '/instructor-panel/course/new' }],
            tab: 0,
            maxWidth: '100%',
            isInstructorRoute: true,
        },
        // {
        //     path: "/instructor-panel/courses/new",
        //     exact: true,
        //     component: InstructorCourses,
        // },
        {
            path: "/instructor-panel/course/edit/:courseIdEditing",
            exact: true,
            component: CourseForm,
            isEditing: true,
            tabs: [{ name: 'Courses', route: '/instructor-panel/courses' }, { name: 'Edit course', route: '/instructor-panel/courses/edit/:courseIdEditing' }],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/new",
            exact: true,
            component: CourseForm,
            tabs: [{ name: 'Courses', route: '/instructor-panel/courses' }, { name: 'New course', route: '/instructor-panel/course/new' }],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/student-panel/courses",
            exact: true,
            component: CourseCards,
            tabs: [{ name: 'All courses', route: '/student-panel/courses' }, { name: 'Your courses', route: '/student-panel/my-courses' }],
            tab: 0,
            maxWidth: '100%',
            isStudentRoute: true,
        },
        {
            path: "/student-panel/my-courses",
            exact: true,
            component: CourseCards,
            tabs: [{ name: 'All courses', route: '/student-panel/courses' }, { name: 'Your courses', route: '/student-panel/my-courses' }],
            tab: 1,
            maxWidth: '100%',
            isStudentRoute: true,
        },
        {
            path: "/student-panel/courses/syllabus/:courseId",
            exact: true,
            isModal: true,
            component: CourseCards,
            tabs: [{ name: 'All courses', route: '/student-panel/courses' }, { name: 'Your courses', route: '/student-panel/my-courses' }],
            tab: 0,
            maxWidth: '100%',
            isStudentRoute: true,
        },
        {
            path: "/authentication",
            exact: true,
            component: Authentication,
            isTokenRequired: false,
        },
        {
            path: "/logout",
            exact: true,
            component: Logout,
            isTokenRequired: false,
        },

        /////////////////////////////////////////////////////// student course routes
        // {
        //     path: "/student-panel/course/:courseId/syllabus",
        //     exact: true,
        //     component: StudentModules,
        // },
        {
            path: "/student-panel/course/:courseId/modules",
            exact: true,
            component: StudentModules,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/lessons",
            exact: true,
            component: Lessons,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/lesson/:lessonId/preview",
            exact: true,
            component: Lesson,
            isStudentRoute: true,

        },
        {
            path: "/student-panel/course/:courseId/tests",
            exact: true,
            component: IncompleteTests,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/student-panel/course/${courseId}/tests` },
                { name: 'Completed tests', route: `/student-panel/course/${courseId}/completed-tests` },
            ],
            tab: 0,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/tests/confirm/:testId",
            exact: true,
            component: IncompleteTests,
            isTest: true,
            isModal: true,
            tabs: [
                { name: 'Tests', route: `/student-panel/course/${courseId}/tests` },
                { name: 'Completed tests', route: `/student-panel/course/${courseId}/completed-tests` },
            ],
            tab: 0,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/completed-tests",
            exact: true,
            component: CompletedTests,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/student-panel/course/${courseId}/tests` },
                { name: 'Completed tests', route: `/student-panel/course/${courseId}/completed-tests` },
            ],
            tab: 1,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/completed-tests/:testId",
            exact: true,
            component: ReviewTest,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/student-panel/course/${courseId}/tests` },
                { name: 'Completed tests', route: `/student-panel/course/${courseId}/completed-tests` },
            ],
            tab: 1,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/assignments",
            exact: true,
            component: IncompleteTests,
            tabs: [
                { name: 'Assignments', route: `/student-panel/course/${courseId}/assignments` },
                { name: 'Completed assignments', route: `/student-panel/course/${courseId}/completed-assignments` },
            ],
            tab: 0,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/completed-assignments",
            exact: true,
            component: CompletedTests,
            tabs: [
                { name: 'Assignments', route: `/student-panel/course/${courseId}/assignments` },
                { name: 'Completed assignments', route: `/student-panel/course/${courseId}/completed-assignments` },
            ],
            tab: 1,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/completed-assignments/:assignmentId",
            exact: true,
            component: ReviewTest,
            tabs: [
                { name: 'Assignments', route: `/student-panel/course/${courseId}/assignments` },
                { name: 'Completed assignments', route: `/student-panel/course/${courseId}/completed-assignments` },
            ],
            tab: 1,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/assignment-in-session/:assignmentId",
            exact: true,
            component: Test,
            isStudentRoute: true,
        },
        // {
        //     path: "/student-panel/course/:courseId/review-assignment/:assignmentId",
        //     exact: true,
        //     component: StudentCourse,
        // },
        {
            path: "/student-panel/course/:courseId/chat/contacts",
            exact: true,
            component: Contacts,
            isStudentRoute: true,
            // tabs: [
            //     { name: 'Contacts', route: `/student-panel/course/${courseId}/chat/contacts` },
            //     { name: 'Chat', route: `/student-panel/course/${courseId}/chat/user/${userId}` },
            // ],
            // tab: 0
        },
        {
            path: "/student-panel/course/:courseId/chat/user/:userId",
            exact: true,
            component: Chat,
            isStudentRoute: true,
            // tabs: [
            //     { name: 'Contacts', route: `/student-panel/course/${courseId}/chat/contacts` },
            //     { name: 'Chat', route: `/student-panel/course/${courseId}/chat/user/${userId}` },
            // ],
            // tab: 1
        },
        {
            path: "/student-panel/course/:courseId/progress-report",
            exact: true,
            component: ProgressReport,
            isStudentRoute: true,
        },
        {
            path: "/student-panel/course/:courseId/resources",
            exact: true,
            component: StudentResources,
            isStudentRoute: true,
        },

        /////////////////////////////////////////////////////// instructor course routes }/lesson/${
        {
            path: "/instructor-panel/course/:courseId/modules",
            exact: true,
            component: InstructorModules,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/lessons",
            exact: true,
            component: Lessons,
            tabs: [{ name: 'Lessons', route: `/instructor-panel/course/${courseId}/lessons` }, { name: 'New lesson', route: `/instructor-panel/course/${courseId}/lesson/new` }],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/lesson/new",
            exact: true,
            component: LessonForm,
            tabs: [{ name: 'Lessons', route: `/instructor-panel/course/${courseId}/lessons` }, { name: 'New lesson', route: `/instructor-panel/course/${courseId}/lesson/new` }],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/lesson/:lessonId/edit",
            exact: true,
            isEditing: true,
            component: LessonForm,
            tabs: [{ name: 'Lessons', route: `/instructor-panel/course/${courseId}/lessons` }, { name: 'Edit lesson', route: `/instructor-panel/course/${courseId}/lesson/${lessonId}/edit` }],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/lesson/:lessonId/preview",
            exact: true,
            component: Lesson,
            tabs: [{ name: 'Lessons', route: `/instructor-panel/course/${courseId}/lessons` }, { name: 'New lesson', route: `/instructor-panel/course/${courseId}/lesson/new` }],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/tests",
            exact: true,
            component: InstructorTests,
            isTest: true,
            isAssignment: false,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'New test', route: `/instructor-panel/course/${courseId}/test/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        // {
        //     path: "/instructor-panel/course/:courseId/test/:testId",
        //     exact: true,
        //     component: StudentCourse,
        // },
        {
            path: "/instructor-panel/course/:courseId/test/new",
            exact: true,
            component: TestForm,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'New test', route: `/instructor-panel/course/${courseId}/test/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/test/:testId/edit",
            exact: true,
            isEditing: true,
            component: TestForm,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'Edit test', route: `/instructor-panel/course/${courseId}/test/${testId}/edit` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        // {
        //     path: "/instructor-panel/course/:courseId/test/question-bank/:questionId",
        //     exact: true,
        //     component: QuestionBank,
        //     isTest:true,
        // },
        // {
        //     path: "/instructor-panel/course/:courseId/test/question-bank/new/:type",
        //     exact: true,
        //     component: QuestionBank,
        //     isTest:true,
        // },
        {
            path: "/instructor-panel/course/:courseId/assignments",
            exact: true,
            component: InstructorTests,
            isTest: false,
            isAssignment: true,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'New assignment', route: `/instructor-panel/course/${courseId}/assignment/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        // {
        //     path: "/instructor-panel/course/:courseId/assignment-test/:workId",
        //     exact: true,
        //     component: StudentCourse,
        // },
        {
            path: "/instructor-panel/course/:courseId/assignment/new",
            exact: true,
            component: TestForm,
            isTest: false,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'New assignment', route: `/instructor-panel/course/${courseId}/assignment/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/assignment/:assignmentId/edit",
            exact: true,
            component: TestForm,
            isTest: false,
            isEditing: true,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'Edit assignment', route: `/instructor-panel/course/${courseId}/assignment/${testId}/edit` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/assignments/question-bank",
            exact: true,
            component: QuestionBank,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'New assignment', route: `/instructor-panel/course/${courseId}/assignment/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/assignments/question-bank/new/:qType",
            exact: true,
            component: Question,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'New assignment', route: `/instructor-panel/course/${courseId}/assignment/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/assignments/question-bank/edit/:questionId",
            exact: true,
            component: Question,
            isEditing: true,
            tabs: [
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/assignments` },
                { name: 'New assignment', route: `/instructor-panel/course/${courseId}/assignment/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/assignments/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/tests/question-bank",
            exact: true,
            component: QuestionBank,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'New test', route: `/instructor-panel/course/${courseId}/test/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/tests/question-bank/new/:qType",
            exact: true,
            isTest: true,
            component: Question,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'New test', route: `/instructor-panel/course/${courseId}/test/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/tests/question-bank/edit/:questionId",
            exact: true,
            isTest: true,
            isEditing: true,
            component: Question,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/tests` },
                { name: 'New test', route: `/instructor-panel/course/${courseId}/test/new` },
                { name: 'Question bank', route: `/instructor-panel/course/${courseId}/tests/question-bank` },
            ],
            tab: 2,
            isInstructorRoute: true,
        },
        // {
        //     path: "/instructor-panel/course/:courseId/assignment/question-bank/:questionId",
        //     exact: true,
        //     component: QuestionBank,
        // },
        {
            path: "/instructor-panel/course/:courseId/grade-tests",
            exact: true,
            component: GradePanel,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/grade-tests` },
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/grade-assignments` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/grade-assignments",
            exact: true,
            component: GradePanel,
            isTest: false,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/grade-tests` },
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/grade-assignments` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/grade-tests/student/:studentId/test/:testId",
            exact: true,
            component: GradeTestForm,
            isTest: true,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/grade-tests` },
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/grade-assignments` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/grade-assignments/student/:studentId/assignment/:assignmentId",
            exact: true,
            component: GradeTestForm,
            isTest: false,
            tabs: [
                { name: 'Tests', route: `/instructor-panel/course/${courseId}/grade-tests` },
                { name: 'Assignments', route: `/instructor-panel/course/${courseId}/grade-assignments` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/chat/contacts",
            exact: true,
            component: Contacts,
            instructorPanel: true,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/chat/user/:userId",
            exact: true,
            component: Chat,
            instructorPanel: true,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/students/enrolled",
            exact: true,
            component: StudentDetail,
            tabs: [
                { name: 'Students', route: `/instructor-panel/course/${courseId}/students/enrolled` },
                { name: 'Enrollment requests', route: `/instructor-panel/course/${courseId}/students/requested` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/students/requested",
            exact: true,
            component: StudentDetail,
            isEnrollmentRequests: true,
            tabs: [
                { name: 'Students', route: `/instructor-panel/course/${courseId}/students/enrolled` },
                { name: 'Enrollment requests', route: `/instructor-panel/course/${courseId}/students/requested` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/students/enrolled/:studentId",
            exact: true,
            isStudent: true,
            component: UserSummary,
            tabs: [
                { name: 'Students', route: `/instructor-panel/course/${courseId}/students/enrolled` },
                { name: 'Enrollment requests', route: `/instructor-panel/course/${courseId}/students/requested` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/students/gradebook/:studentId",
            exact: true,
            isStudent: true,
            component: Gradebook,
            tabs: [
                { name: 'Students', route: `/instructor-panel/course/${courseId}/students/enrolled` },
                { name: 'Enrollment requests', route: `/instructor-panel/course/${courseId}/students/requested` },
            ],
            tab: 0,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/students/requested/:studentId",
            exact: true,
            isStudent: true,
            component: EnrollmentStudentConfirmation,
            isEnrollmentRequests: true,
            tabs: [
                { name: 'Students', route: `/instructor-panel/course/${courseId}/students/enrolled` },
                { name: 'Enrollment requests', route: `/instructor-panel/course/${courseId}/students/requested` },
            ],
            tab: 1,
            isInstructorRoute: true,
        },
        {
            path: "/instructor-panel/course/:courseId/resources",
            exact: true,
            component: InstructorResources,
            isInstructorRoute: true,
        },
    ]
    // .filter(r=>{
    //     if(isTestInSession) {
    //         return r.path === '/student-panel/course/:courseId/test-in-session' || r.path === '/authentication'
    //     }
    //     return true
    // })
}