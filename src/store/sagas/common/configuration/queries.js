export const fetchConfigurationQuery = () => {
  const graphqlQuery = {
    query: `
            query Configuration {
              configuration {
                _id
                user
                isChatNotifications
                isChatPushNotifications
                isStayLoggedIn
                isHideActiveStatus
                dropCourseGrade
                isDropCoursePenalty
                coursePassGrade
                isEnrollAllowedAfterDropCourse
                isInstructorCoursesLimit
                instructorCoursesLimit
                isApproveInstructorAccounts
                isApproveStudentAccounts
                isApproveEnrollments
                isContentBlockedCourseEnd
                studentFileSizeLimit
                instructorFileSizeLimit
                isPasswordRequiredStartTest
                voiceRecordTimeLimit
                blockedInstructors
                isChatAllowedOutsideOfficehours
                isSendTestNotifications
                isSendTestEmails
                isSendTestPushNotifications
                isSendLessonNotifications
                isSendLessonEmails
                isSendLessonPushNotifications
                isSendAssignmentNotifications
                isSendAssignmentEmails
                isSendAssignmentPushNotifications
                isSendCourseNotifications
                isSendCourseEmails
                isSendCoursePushNotifications
                isTestNotifications
                isTestEmails
                isTestPushNotifications
                isLessonNotifications
                isLessonEmails
                isLessonPushNotifications
                isAssignmentNotifications
                isAssignmentEmails
                isAssignmentPushNotifications
                isCourseNotifications
                isCourseEmails
                isCoursePushNotifications
                blockedStudents
                blockedStudentsChat

                isAllowDeleteStudentAccount
                isAllowDeleteInstructorAccount

                isNewInstructorAccountNotifications
                isNewInstructorAccountEmails
                isNewInstructorAccountPushNotifications
                isNewStudentAccountNotifications
                isNewStudentAccountEmails
                isNewStudentAccountPushNotifications

                isDropCourseNotifications
                isDropCourseEmails
                isDropCoursePushNotifications

                isEnrollNotifications
                isEnrollEmails
                isEnrollPushNotifications

                coursesIsChatAllowedOutsideOfficehours
              }
            }
          `,
  };
  return graphqlQuery;
};

export const updateConfigurationQuery = ({ configData }) => {
  const graphqlQuery = {
    query: `
           mutation UpdateConfiguration(
             $isChatNotifications:Boolean!
             $isChatPushNotifications:Boolean!
             $isHideActiveStatus: Boolean!
             $isStayLoggedIn: Boolean!
             $dropCourseGrade: Float
             $isDropCoursePenalty: Boolean
             $coursePassGrade: Float
             $isEnrollAllowedAfterDropCourse:Boolean
             $isInstructorCoursesLimit:Boolean
             $instructorCoursesLimit:Int
             $isApproveInstructorAccounts:Boolean
             $isApproveStudentAccounts:Boolean
             $isApproveEnrollments:Boolean
             $isContentBlockedCourseEnd:Boolean
             $studentFileSizeLimit:Float
             $instructorFileSizeLimit:Float
             $isPasswordRequiredStartTest:Boolean
             $voiceRecordTimeLimit:Float
             $blockedInstructors:[ID]
             $isChatAllowedOutsideOfficehours:Boolean
             $isTestNotifications:Boolean
             $isTestEmails:Boolean
             $isTestPushNotifications:Boolean
             $isLessonNotifications:Boolean
             $isLessonEmails:Boolean
             $isLessonPushNotifications:Boolean
             $isAssignmentNotifications:Boolean
             $isAssignmentEmails:Boolean
             $isAssignmentPushNotifications:Boolean
             $isCourseNotifications:Boolean
             $isCourseEmails:Boolean
             $isCoursePushNotifications:Boolean
             $isSendTestNotifications:Boolean
             $isSendTestEmails:Boolean
             $isSendTestPushNotifications:Boolean
             $isSendLessonNotifications:Boolean
             $isSendLessonEmails:Boolean
             $isSendLessonPushNotifications:Boolean
             $isSendAssignmentNotifications:Boolean
             $isSendAssignmentEmails:Boolean
             $isSendAssignmentPushNotifications:Boolean
             $isSendCourseNotifications:Boolean
             $isSendCourseEmails:Boolean
             $isSendCoursePushNotifications:Boolean
             $blockedStudents:[ID]
             $blockedStudentsChat:[ID]
             $isAllowDeleteStudentAccount:Boolean
             $isAllowDeleteInstructorAccount:Boolean
             $isNewInstructorAccountNotifications:Boolean
             $isNewInstructorAccountEmails:Boolean
             $isNewInstructorAccountPushNotifications:Boolean
             $isNewStudentAccountNotifications:Boolean
             $isNewStudentAccountEmails:Boolean
             $isNewStudentAccountPushNotifications:Boolean
             $isDropCourseNotifications:Boolean
             $isDropCourseEmails:Boolean
             $isDropCoursePushNotifications:Boolean
             $isEnrollNotifications:Boolean
             $isEnrollEmails:Boolean
             $isEnrollPushNotifications:Boolean
             ) {
             updateConfiguration(configurationInput: {
              isChatNotifications:$isChatNotifications,
              isChatPushNotifications:$isChatPushNotifications,
              isHideActiveStatus: $isHideActiveStatus,
              isStayLoggedIn: $isStayLoggedIn,
              dropCourseGrade: $dropCourseGrade,
              isDropCoursePenalty: $isDropCoursePenalty
              coursePassGrade: $coursePassGrade
              isEnrollAllowedAfterDropCourse: $isEnrollAllowedAfterDropCourse
              instructorCoursesLimit: $instructorCoursesLimit
              isInstructorCoursesLimit: $isInstructorCoursesLimit
              isApproveInstructorAccounts: $isApproveInstructorAccounts
              isApproveStudentAccounts: $isApproveStudentAccounts
              isApproveEnrollments: $isApproveEnrollments
              isContentBlockedCourseEnd: $isContentBlockedCourseEnd
              studentFileSizeLimit: $studentFileSizeLimit
              instructorFileSizeLimit: $instructorFileSizeLimit
              isPasswordRequiredStartTest: $isPasswordRequiredStartTest
              voiceRecordTimeLimit: $voiceRecordTimeLimit
              blockedInstructors: $blockedInstructors
              isChatAllowedOutsideOfficehours: $isChatAllowedOutsideOfficehours
              isTestNotifications: $isTestNotifications
              isTestEmails: $isTestEmails
              isTestPushNotifications: $isTestPushNotifications
              isLessonNotifications: $isLessonNotifications
              isLessonEmails: $isLessonEmails
              isLessonPushNotifications: $isLessonPushNotifications
              isAssignmentNotifications: $isAssignmentNotifications
              isAssignmentEmails: $isAssignmentEmails
              isAssignmentPushNotifications: $isAssignmentPushNotifications
              isCourseNotifications: $isCourseNotifications
              isCourseEmails: $isCourseEmails
              isCoursePushNotifications: $isCoursePushNotifications
              isSendTestNotifications:$isSendTestNotifications
              isSendTestEmails:$isSendTestEmails
              isSendTestPushNotifications:$isSendTestPushNotifications
              isSendLessonNotifications:$isSendLessonNotifications
              isSendLessonEmails:$isSendLessonEmails
              isSendLessonPushNotifications:$isSendLessonPushNotifications
              isSendAssignmentNotifications:$isSendAssignmentNotifications
              isSendAssignmentEmails:$isSendAssignmentEmails
              isSendAssignmentPushNotifications:$isSendAssignmentPushNotifications
              isSendCourseNotifications:$isSendCourseNotifications
              isSendCourseEmails:$isSendCourseEmails
              isSendCoursePushNotifications:$isSendCoursePushNotifications
              blockedStudents: $blockedStudents
              blockedStudentsChat: $blockedStudentsChat
              isAllowDeleteStudentAccount: $isAllowDeleteStudentAccount
              isAllowDeleteInstructorAccount: $isAllowDeleteInstructorAccount
              isNewInstructorAccountNotifications: $isNewInstructorAccountNotifications
              isNewInstructorAccountEmails: $isNewInstructorAccountEmails
              isNewInstructorAccountPushNotifications: $isNewInstructorAccountPushNotifications
              isNewStudentAccountNotifications: $isNewStudentAccountNotifications
              isNewStudentAccountEmails: $isNewStudentAccountEmails
              isNewStudentAccountPushNotifications: $isNewStudentAccountPushNotifications
              isDropCourseNotifications: $isDropCourseNotifications
              isDropCourseEmails: $isDropCourseEmails
              isDropCoursePushNotifications: $isDropCoursePushNotifications
              isEnrollNotifications: $isEnrollNotifications
              isEnrollEmails: $isEnrollEmails
              isEnrollPushNotifications: $isEnrollPushNotifications
              }) {
                token
                expiresIn
                refreshTokenExpiration
              }
           }
         `,
    variables: {
      isChatNotifications: configData.isChatNotifications,
      isChatPushNotifications: configData.isChatPushNotifications,
      isHideActiveStatus: configData.isHideActiveStatus,
      isStayLoggedIn: configData.isStayLoggedIn,
      dropCourseGrade:parseFloat(parseFloat(configData.dropCourseGrade).toFixed(2)),
      isDropCoursePenalty: configData.isDropCoursePenalty,
      coursePassGrade: parseFloat(parseFloat(configData.coursePassGrade).toFixed(2)),
      isEnrollAllowedAfterDropCourse: configData.isEnrollAllowedAfterDropCourse,
      isInstructorCoursesLimit: configData.isInstructorCoursesLimit,
      instructorCoursesLimit: parseInt(configData.instructorCoursesLimit),
      isApproveInstructorAccounts: configData.isApproveInstructorAccounts,
      isApproveStudentAccounts: configData.isApproveStudentAccounts,
      isApproveEnrollments: configData.isApproveEnrollments,
      isContentBlockedCourseEnd: configData.isContentBlockedCourseEnd,
      studentFileSizeLimit: parseFloat(parseFloat(configData.studentFileSizeLimit).toFixed(2)),
      instructorFileSizeLimit: parseFloat(parseFloat(configData.instructorFileSizeLimit).toFixed(2)),
      isPasswordRequiredStartTest: configData.isPasswordRequiredStartTest,
      voiceRecordTimeLimit: parseFloat(parseFloat(configData.voiceRecordTimeLimit).toFixed(2)),
      blockedInstructors: configData.blockedInstructors,
      isChatAllowedOutsideOfficehours: configData.isChatAllowedOutsideOfficehours,
      isTestNotifications: configData.isTestNotifications,
      isTestEmails: configData.isTestEmails,
      isTestPushNotifications: configData.isTestPushNotifications,
      isLessonNotifications: configData.isLessonNotifications,
      isLessonEmails: configData.isLessonEmails,
      isLessonPushNotifications: configData.isLessonPushNotifications,
      isAssignmentNotifications: configData.isAssignmentNotifications,
      isAssignmentEmails: configData.isAssignmentEmails,
      isAssignmentPushNotifications: configData.isAssignmentPushNotifications,
      isCourseNotifications: configData.isCourseNotifications,
      isCourseEmails: configData.isCourseEmails,
      isCoursePushNotifications: configData.isCoursePushNotifications,
      blockedStudents: configData.blockedStudents,
      blockedStudentsChat: configData.blockedStudentsChat,
      isSendTestNotifications: configData.isSendTestNotifications,
      isSendTestEmails: configData.isSendTestEmails,
      isSendTestPushNotifications: configData.isSendTestPushNotifications,
      isSendLessonNotifications: configData.isSendLessonNotifications,
      isSendLessonEmails: configData.isSendLessonEmails,
      isSendLessonPushNotifications: configData.isSendLessonPushNotifications,
      isSendAssignmentNotifications: configData.isSendAssignmentNotifications,
      isSendAssignmentEmails: configData.isSendAssignmentEmails,
      isSendAssignmentPushNotifications: configData.isSendAssignmentPushNotifications,
      isSendCourseNotifications: configData.isSendCourseNotifications,
      isSendCourseEmails: configData.isSendCourseEmails,
      isSendCoursePushNotifications: configData.isSendCoursePushNotifications,

      isAllowDeleteStudentAccount: configData.isAllowDeleteStudentAccount,
      isAllowDeleteInstructorAccount: configData.isAllowDeleteInstructorAccount,
      isNewInstructorAccountNotifications: configData.isNewInstructorAccountNotifications,
      isNewInstructorAccountEmails: configData.isNewInstructorAccountEmails,
      isNewInstructorAccountPushNotifications: configData.isNewInstructorAccountPushNotifications,
      isNewStudentAccountNotifications: configData.isNewStudentAccountNotifications,
      isNewStudentAccountEmails: configData.isNewStudentAccountEmails,
      isNewStudentAccountPushNotifications: configData.isNewStudentAccountPushNotifications,
      isDropCourseNotifications: configData.isDropCourseNotifications,
      isDropCourseEmails: configData.isDropCourseEmails,
      isDropCoursePushNotifications: configData.isDropCoursePushNotifications,
      isEnrollNotifications: configData.isEnrollNotifications,
      isEnrollEmails: configData.isEnrollEmails,
      isEnrollPushNotifications: configData.isEnrollPushNotifications,
    },
  };
  return graphqlQuery;
};
