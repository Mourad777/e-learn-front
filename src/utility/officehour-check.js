import { getDayIndex } from "./getDayIndex";
import moment from "moment";
import momentTZ from "moment-timezone";

const getTimeStamp = (time) => {
  return new Date(`01/01/2020 ${time}`).getTime();
};

export const isOfficeHourCheck = (course) => {
  if (!course) return {
    isIrregOfficeHour: null, isRegOfficeHour: null
  }
  const currentTime = `${moment().hour()}:${moment().minutes()}`;
  const isRegOfficeHour =
    (course.regularOfficeHours || []).findIndex((oh) => {
      const startTimeStamp = getTimeStamp((oh || {}).startTime);

      const startTimeStampAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(startTimeStamp) * 60 * 1000 +
        startTimeStamp;

      const endTimeStamp = getTimeStamp((oh || {}).endTime);
      const endTimeStampAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(endTimeStamp) * 60 * 1000 +
        endTimeStamp;

      const currentTimeAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(getTimeStamp(currentTime)) * 60 * 1000 +
        getTimeStamp(currentTime);

      if (
        new Date().getDay() === getDayIndex(oh.day) &&
        currentTimeAdjusted >= startTimeStampAdjusted &&
        currentTimeAdjusted < endTimeStampAdjusted
      ) {
        return oh;
      }
    }) > -1;

  const isIrregOfficeHour =
    (course.irregularOfficeHours || []).findIndex((oh) => {
      const startTimeStamp = getTimeStamp((oh || {}).startTime);

      const startTimeStampAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(startTimeStamp) * 60 * 1000 +
        startTimeStamp;

      const endTimeStamp = getTimeStamp((oh || {}).endTime);
      const endTimeStampAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(endTimeStamp) * 60 * 1000 +
        endTimeStamp;

      const currentTimeAdjusted =
        momentTZ.tz.zone((oh || {}).timezoneRegion).utcOffset(getTimeStamp(currentTime)) * 60 * 1000 +
        getTimeStamp(currentTime);
      if (
        new Date(Date.now()).setHours(0, 0, 0, 0).toString() ===
        parseInt(oh.date).toString() &&
        currentTimeAdjusted >= startTimeStampAdjusted &&
        currentTimeAdjusted < endTimeStampAdjusted
      ) {
        return oh;
      }
    }) > -1;
  return {
    isRegOfficeHour,
    isIrregOfficeHour,
  };
};

const getEarliestWeeklyOfficeHour = (
  course,
  startTimeOrEndTime,
  timeStampNow
) => {
  if(!course)return;
  const earliestRegularOfficeHour = (course.regularOfficeHours || [])
    .map((oh) => {
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      const start = moment(Date.now()),
        end = moment(parseInt(Date.now() + 1000 * 60 * 60 * 48)),
        day = getDayIndex(oh.day);
      let result;
      const current = start.clone();
      while (current.day(0 + day).isBefore(end)) {
        result = current.clone()._d;

        const date = new Date(
          `${moment(new Date(result)).format("MM/DD/YYYY")} ${oh[startTimeOrEndTime]
          }`
        ).getTime();
        if (date < Date.now()) return null;
        // if (date > Date.now() + oneWeek) return null;
        return new Date(date).getTime();
      }
    })
    .sort()
    .filter((d) => d)[0];

  return earliestRegularOfficeHour;
};

const getEarliestIrregularOfficeHour = (
  course,
  startTimeOrEndTime,
  timeStampNow
) => {
  if(!course)return
  const earliestIrregularOfficeHour = (course.irregularOfficeHours || [])
    .map((oh) => {
      const date = new Date(
        `${moment(parseInt(oh.date)).format("MM/DD/YYYY")} ${oh[startTimeOrEndTime]
        }`
      ).getTime();
      if (date <= (timeStampNow || Date.now())) return null;
      return date;
    })
    .sort()
    .filter((t) => t)[0];

  return earliestIrregularOfficeHour;
};

export const getStartOrEndTime = (course, timeStampNow) => {
  const { isIrregOfficeHour, isRegOfficeHour } = isOfficeHourCheck(course);
  let earliestRegularOfficeHourStart,
    earliestRegularOfficeHourEnd,
    earliestIrregularOfficeHourStart,
    earliestIrregularOfficeHourEnd;
  if (isIrregOfficeHour || isRegOfficeHour) {
    earliestRegularOfficeHourEnd = getEarliestWeeklyOfficeHour(
      course,
      "endTime",
      timeStampNow
    );

    earliestIrregularOfficeHourEnd = getEarliestIrregularOfficeHour(
      course,
      "endTime",
      timeStampNow
    );
  }
  if (!isIrregOfficeHour && !isRegOfficeHour) {
    earliestRegularOfficeHourStart = getEarliestWeeklyOfficeHour(
      course,
      "startTime",
      timeStampNow
    );
    earliestIrregularOfficeHourStart = getEarliestIrregularOfficeHour(
      course,
      "startTime",
      timeStampNow
    );
  }

  const timeStamp = [
    earliestIrregularOfficeHourStart,
    earliestRegularOfficeHourStart,
    earliestIrregularOfficeHourEnd,
    earliestRegularOfficeHourEnd,
  ]
    .filter((i) => i)
    .sort()[0];

  return timeStamp;
};
