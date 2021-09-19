import { isOfficeHourCheck, getStartOrEndTime } from "../../../../utility/officehour-check";

export const runChatTimeout = (startEndTime, timeoutId, course, setIsOfficeHour) => {
    if(!course || !startEndTime)return
    timeoutId = setTimeout(() => {
        const { isIrregOfficeHour, isRegOfficeHour } = isOfficeHourCheck(
            course
        );
        setIsOfficeHour(!!(isIrregOfficeHour || isRegOfficeHour));
        if (!startEndTime) {
            clearTimeout(timeoutId);
            return;
        }
        runChatTimeout(getStartOrEndTime(course, Date.now()));
    }, startEndTime - Date.now());
};