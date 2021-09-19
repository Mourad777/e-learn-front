import React from "react"
import NavigationItem from "../../../components/Navigation/NavigationItems/NavigationItem/NavigationItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { checkMatch } from "../../../utility/checkUrlMatch";
import NavIcon from "../SideMenu/NavIcon";

export const getLinks = (links, location, t, courseId, handleDrawer) => {
    return links.map(l => {
        const isSelected = l.matches.findIndex(m => {
            return checkMatch(location, m)
        }) > -1
        return (
            <NavigationItem
                key={l.link}
                link={l.link}
                selected={isSelected}
                disabled={l.disabled}
                clicked={()=>handleDrawer('close')}
            >
                <ListItemIcon>
                    <NavIcon isSelected={isSelected} link={l.link} courseId={courseId} />
                </ListItemIcon>
                <ListItemText primary={t(l.text)} />
            </NavigationItem>
        )
    })
}

export const getCommonLinks = (userType,isAccountActivated) => {
    return [
        {
            link: "/student-panel/courses",
            matches: ["/student-panel/courses", "/student-panel/my-courses"],
            text: "layout.drawer.courses",
        },
        {
            link: "/instructor-panel/courses",
            matches: ["/instructor-panel/courses", "/instructor-panel/course/new","/instructor-panel/course/edit/:courseIdEditing"],
            text: "layout.drawer.courses",
        },
        {
            link: "/transcript",//only student
            matches: ["/transcript"],
            text: "layout.drawer.transcript",
            disabled:!isAccountActivated
        },
        {
            link: "/users/instructors",// only admin
            matches: ['/users/instructors', '/users/instructors/:instructorId', '/users/students', '/users/students/:studentId'],
            text: "layout.drawer.users",
        },
        {
            link: "/account",
            matches: ["/account"],
            text: "layout.drawer.account",
            disabled:!isAccountActivated
        },
        {
            link: "/configuration",
            matches: ["/configuration"],
            text: "layout.drawer.config",
            disabled:!isAccountActivated
        },



    ].filter(l => {
        if (userType === 'student') {
            if (l.link === "/instructor-panel/courses" || l.link === "/users/instructors") {
                return false
            } else {
                return true
            }
        }
        if (userType === 'instructor') {
            if (l.link === "/student-panel/courses" || l.link === "/transcript" || l.link === "/users/instructors") {
                return false
            } else {
                return true
            }
        }
        if (userType === 'admin') {
            if (l.link === "/student-panel/courses" || l.link === "/transcript") {
                return false
            } else {
                return true
            }
        }
    })
}

export const getStudentCourseLinks = (courseId) => {
    const courseLinks = [
        {
            link: `/student-panel/course/${courseId}/modules`,
            matches: ["/student-panel/course/:courseId/modules"],
            text: "layout.drawer.modules",
        },
        {
            link: `/student-panel/course/${courseId}/lessons`,
            matches: ["/student-panel/course/:courseId/lessons", "/student-panel/course/:courseId/lesson/:lessonId/preview"],
            text: "layout.drawer.lessons",
        },
        {
            link: `/student-panel/course/${courseId}/assignments`,
            matches: ["/student-panel/course/:courseId/assignments", "/student-panel/course/:courseId/completed-assignments", "/student-panel/course/:courseId/assignment-in-session/:assignmentId"],
            text: "layout.drawer.assignments",
        },
        {
            link: `/student-panel/course/${courseId}/tests`,
            matches: ["/student-panel/course/:courseId/tests", "/student-panel/course/:courseId/completed-tests"],
            text: "layout.drawer.tests",
        },
        {
            link: `/student-panel/course/${courseId}/chat/contacts`,
            matches: ["/student-panel/course/:courseId/chat/contacts", "/student-panel/course/:courseId/chat/:userId"],
            text: "layout.drawer.chat",
        },

        {
            link: `/student-panel/course/${courseId}/progress-report`,
            matches: ["/student-panel/course/:courseId/progress-report"],
            text: "layout.drawer.progressReport",
        },
        {
            link: `/student-panel/course/${courseId}/resources`,
            matches: ["/student-panel/course/:courseId/resources"],
            text: "layout.drawer.resources",
        },
    ]
    return courseLinks
}

export const getTestSessionLinks = (courseId) => {
    const courseLinks = [
        {
            link: `/student-panel/course/${courseId}/lessons`,
            matches: ["/student-panel/course/:courseId/lessons", "/student-panel/course/:courseId/lesson/:lessonId/preview"],
            text: "layout.drawer.lessons",
        },
        {
            link: `/student-panel/course/${courseId}/test-in-session`,
            matches: ["/student-panel/course/:courseId/test-in-session"],
            text: "layout.drawer.test",
        }
    ]
    return courseLinks
}

export const getInstructorCourseLinks = (courseId) => {
    const courseLinks = [
        {
            link: `/instructor-panel/course/${courseId}/modules`,
            matches: ["/instructor-panel/course/:courseId/modules"],
            text: "layout.drawer.modules",
        },
        {
            link: `/instructor-panel/course/${courseId}/lessons`,
            matches: [
                "/instructor-panel/course/:courseId/lessons",
                "/instructor-panel/course/:courseId/lesson/:lessonId/preview",
                '/instructor-panel/course/:courseId/lesson/new',
                '/instructor-panel/course/:courseId/lesson/:lessonId/edit'
            ],
            text: "layout.drawer.lessons",
        },
        {
            link: `/instructor-panel/course/${courseId}/assignments`,
            matches: [
                "/instructor-panel/course/:courseId/assignments",
                "/instructor-panel/course/:courseId/assignment/new",
                "/instructor-panel/course/:courseId/assignment/:assignmentId/edit",
                "/instructor-panel/course/:courseId/assignments/question-bank"
            ],
            text: "layout.drawer.assignments",
        },
        {
            link: `/instructor-panel/course/${courseId}/tests`,
            matches: [
                "/instructor-panel/course/:courseId/tests",
                "/instructor-panel/course/:courseId/test/new",
                "/instructor-panel/course/:courseId/test/:testId/edit",
                "/instructor-panel/course/:courseId/tests/question-bank"
            ],
            text: "layout.drawer.tests",
        },
        {
            link: `/instructor-panel/course/${courseId}/grade-tests`,
            matches: ['/instructor-panel/course/:courseId/grade-tests','/instructor-panel/course/:courseId/grade-assignments'],
            text: "layout.drawer.grades",
        },
        {
            link: `/instructor-panel/course/${courseId}/chat/contacts`,
            matches: [
                "/instructor-panel/course/:courseId/chat/contacts", 
                "/instructor-panel/course/:courseId/chat/:userId"
            ],
            text: "layout.drawer.chat",
        },
        {
            link: `/instructor-panel/course/${courseId}/students/enrolled`,
            matches: [
                '/instructor-panel/course/:courseId/students/enrolled', 
                '/instructor-panel/course/:courseId/students/requested',
                '/instructor-panel/course/:courseId/students/gradebook/:studentId'
            ],
            text: "layout.drawer.students",
        },
        {
            link: `/instructor-panel/course/${courseId}/resources`,
            matches: ["/instructor-panel/course/:courseId/resources"],
            text: "layout.drawer.resources",
        },
    ]
    return courseLinks
}

export const getLogoutLink = () => {
    return [{
        link: "/logout",
        matches: ["/logout"],
        text: "layout.drawer.logout",
      }]
}