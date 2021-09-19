import React from 'react'
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import EditIcon from "@material-ui/icons/Edit";
import ChatIcon from "@material-ui/icons/Chat";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import GroupIcon from "@material-ui/icons/Group";

const NavIcon = ({ isSelected, link, courseId }) => {
    let icon;
    switch (link) {
        case "/student-panel/courses":
            icon = <DynamicFeedIcon color={isSelected ? 'primary' : "inherit"} />
            break;
        case "/instructor-panel/courses":
            icon = <DynamicFeedIcon color={isSelected ? 'primary' : "inherit"} />
            break;
        case "/users/instructors":
            icon = <PeopleAltIcon color={isSelected ? 'primary' : "inherit"} />
            break;
        case "/transcript":
            icon = <ListAltIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case "/account":
            icon = <AccountBoxIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case "/configuration":
            icon = <SettingsIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case "/logout":
            icon = <LockOpenIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/modules`:
            icon = <AccountTreeIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/lessons`:
            icon = <ChromeReaderModeIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/student-panel/course/${courseId}/tests`:
            icon = <AssessmentIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/test-in-session`:
            icon = <AssessmentIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/assignments`:
            icon = <EditIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/chat/contacts`:
            icon = <ChatIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/progress-report`:
            icon = <SpellcheckIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/student-panel/course/${courseId}/resources`:
            icon = <LibraryBooksIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/modules`:
            icon = <AccountTreeIcon color={isSelected ? 'primary' : "inherit"} />;
            break;
        case `/instructor-panel/course/${courseId}/lessons`:
            icon = <ChromeReaderModeIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/tests`:
            icon = <AssessmentIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/assignments`:
            icon = <EditIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/grade-tests`:
            icon = <SpellcheckIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/chat/contacts`:
            icon = <ChatIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/students/enrolled`:
            icon = <GroupIcon color={isSelected ? 'primary' : "inherit"} />;
            break;

        case `/instructor-panel/course/${courseId}/resources`:
            icon = <LibraryBooksIcon color={isSelected ? 'primary' : "inherit"} />;
            break;






        // case `/student-panel/course/${courseId}/lessons`:
        //   icon = <ChromeReaderModeIcon color={isSelected ? 'primary' : "inherit"} />;
        //   break;


    }
    return icon
}

export default NavIcon;