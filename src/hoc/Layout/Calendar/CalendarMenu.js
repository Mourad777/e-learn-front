import React from "react"
import {connect} from "react-redux"
import Calendar from "react-calendar";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import CalendarIcon from "./CalendarIcon";
import { getCalendarTileColor } from "../util/getCalendarTileColor";
import CalendarTileIcon from "./CalendarTileIcon";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";
import { ListItem } from "@material-ui/core";
import { getDocumentDates } from "../util/getDocumentDates";
import {  useTranslation } from "react-i18next";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Aux from "../../Auxiliary/Auxiliary";
import { ListItemIcon } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "./Calendar.css";

const isDateContent = (date, docs) => {
    return docs.findIndex(doc=>doc.date === date) > -1
}

const CalendarMenu = ({courses,studentLoggedIn,instructorLoggedIn, calendar,handleDocument, handleClose  }) => {
    const { t } = useTranslation("common");
    const documentDates = getDocumentDates(courses,studentLoggedIn,instructorLoggedIn,t)
    const [selectedDay, setSelectedDay] = React.useState(null);
    const calendarOpen = Boolean(calendar);
    const handleSelectedCalendarDay = (calendarDay) => {
        if(!isDateContent(calendarDay,documentDates) && !!calendarDay)return
        setSelectedDay(calendarDay);
      };

    return (<Menu
        anchorEl={calendar}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        open={calendarOpen}
        onClose={handleClose}
    >
        <div style={{ minHeight: 200, padding: 5 }}>
            {!selectedDay ? (
                <Calendar
                    locale={localStorage.getItem("i18nextLng")}
                    onClickDay={(day) => {
                        handleSelectedCalendarDay(new Date(day).getTime());
                    }}
                    tileContent={({ activeStartDate, date, view }) => {
                        return <CalendarTileIcon date={date} documentDates={documentDates} />
                    }}
                    tileClassName={({ date, view }) => {
                        return getCalendarTileColor(date, documentDates)
                    }}
                />
            ) : (
                    <div>
                        <Typography variant="h5">
                            {" "}
                            {moment(selectedDay)
                                .locale(localStorage.getItem("i18nextLng"))
                                .format("MMMM DD")}
                        </Typography>

                        {(courses || []).map((c) => {
                            if (
                                !(
                                    documentDates.findIndex(
                                        (d) =>
                                            d.date === selectedDay && c._id === d.course
                                    ) > -1
                                )
                            )
                                return null;
                            return (
                                <Aux key={c._id}>
                                    <List
                                        style={{
                                            margin: "10px auto 10px auto",
                                            padding: "5px",
                                        }}
                                    >
                                        <ListItem
                                            style={{
                                                backgroundColor: "#2196f3",
                                                color: "white",
                                            }}
                                        >
                                            <ListItemText>{c.courseName}</ListItemText>
                                        </ListItem>
                                        {documentDates
                                            .filter((d) => d.course === c._id)
                                            .filter((d) => d.date === selectedDay)
                                            .map((d, i) => {


                                                return (
                                                    <Aux key={d.docName + i}>
                                                        <ListItem
                                                            button
                                                            onClick={() =>
                                                                handleDocument(d, "calendar")
                                                            }
                                                        >
                                                            <ListItemIcon><CalendarIcon d={d} /></ListItemIcon>

                                                            <ListItemText>
                                                                {d.docName}
                                                            </ListItemText>
                                                        </ListItem>
                                                    </Aux>
                                                );
                                            })}
                                    </List>
                                </Aux>
                            );
                        })}
                        {selectedDay && (
                            <IconButton
                                color="inherit"
                                onClick={() => handleSelectedCalendarDay(null)}
                            >
                                <CalendarTodayIcon />
                            </IconButton>
                        )}
                    </div>
                )}
        </div>
    </Menu>)
}

const mapStateToProps = (state) => {
    return {
      courses: state.common.courses,
      instructorLoggedIn: state.authentication.instructorLoggedIn,
      studentLoggedIn: state.authentication.studentLoggedIn,
    };
  };
  
  export default connect(mapStateToProps)(CalendarMenu);
  