import { ResponsiveLine } from "@nivo/line";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { getCourse } from "../../../utility/getCourse";
import Typography from "@material-ui/core/Typography";

const MyResponsiveLine = ({
  course,
  studentTestResults={},
  student,
  students,
  instructorLoggedIn,
  studentLoggedIn,
  isDarkTheme,
}) => {
  const { t } = useTranslation()
  if (!course) return null;
  const tests = course.tests;
  let results;
  if (studentLoggedIn) {
    results = ((studentTestResults||{}).testResults || []).filter(
      (r) => r.graded && r.grade !== null && !r.isExcused
    );
  }
  if (instructorLoggedIn) {
    const students = course.studentsEnrollRequests
      .filter((r) => (r.approved || r.droppedOut || r.denied))
      .map((r) => r.student) || [];

    results = (((students || [])
      .find((s) => s._id === student._id) || {})
      .testResults || []).filter((r) => r.graded && r.grade !== null && !r.isExcused);

  }
  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  };

  const courseResults = results.filter(
    (r) =>
      r.course === course._id && tests.findIndex((t) => t._id === r.test) > -1
  );

  const progress = courseResults
    .map((cr, i) => {
      const { testName, assignment, createdAt, availableOnDate } = tests.find(
        (t) => t._id === cr.test
      );
      return {
        x: `${testName} (${assignment ? t("progressReport.assignment") : t("progressReport.test")})`,
        y: cr.grade,
        createdAt: availableOnDate
          ? parseInt(availableOnDate)
          : parseInt(createdAt),
      };
    })
    .sort(compare); //sort by available on date, if no available on date sort by date createdat

  const average = courseResults
    .map((cr, i) => {
      const {
        classAverage,
        testName,
        assignment,
        createdAt,
        availableOnDate,
      } = tests.find((t) => t._id === cr.test);
      return {
        x: `${testName} (${assignment ? t("progressReport.assignment") : t("progressReport.test")})`,
        y: classAverage,
        createdAt: availableOnDate
          ? parseInt(availableOnDate)
          : parseInt(createdAt),
      };
    })
    .sort(compare);

  const data = [
    {
      id: studentLoggedIn ? t("progressReport.yourProgress") : t("progressReport.studentProgress"),
      color: "hsl(193, 70%, 50%)",
      data: progress,
    },
    {
      id: t("progressReport.classAverage"),
      color: "hsl(11, 70%, 50%)",
      data: average,
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.progressReport")}</Typography>
      <ResponsiveLine
        data={data}
        margin={{ top: 70, right: 10, bottom: 150, left: 45 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: 100,
          stacked: false,
          reverse: false,
        }}
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 30,
          tickRotation: -85,
          legend: t("progressReport.assignmentsTests"),
          legendOffset: 10,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: t("progressReport.grade"),
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "category10" }}
        lineWidth={5}
        theme={isDarkTheme ? {
          textColor: 'white', background: '#424242', tooltip: { basic: { background: "#424242" }, container: { background: "#424242" } }
        } : {}}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        areaBaselineValue={30}
        areaOpacity={0.05}
        useMesh={true}
        legends={[
          {
            anchor: "top",
            direction: "row",
            justify: false,
            translateX: -28,
            translateY: -60,
            itemsSpacing: 20,
            itemDirection: "top-to-bottom",
            itemWidth: 100,
            itemHeight: 74,
            itemOpacity: 0.75,
            symbolSize: 18,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            itemTextColor: isDarkTheme ? 'white' : 'black',
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        motionStiffness={80}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  
  const populatedCourse = getCourse(state.common.courses,state.common.selectedCourse);
  return {
    students: state.common.students,
    course: populatedCourse,
    token: state.authentication.token,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    studentLoggedIn: state.authentication.studentLoggedIn,
    studentTestResults: state.studentTest.testResults,
    modalDocument: state.common.modalDocument,
    isDarkTheme: state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps)(MyResponsiveLine);
