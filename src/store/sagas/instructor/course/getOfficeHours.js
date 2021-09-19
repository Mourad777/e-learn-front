export const getOfficeHours = (formData) => {
    const regularOfficeHourDays = Object.keys(
        (formData.regularOfficeHours || {}).times || []
      );
      const regularOfficeHourTimes = Object.values(
        (formData.regularOfficeHours || {}).times || []
      );
      const selectedDays = (formData.regularOfficeHours || {}).days;
      let regularOfficeHours = "";
      (regularOfficeHourDays || []).forEach((day, index) => {
        if (!selectedDays.includes(day)) return null;
        regularOfficeHours += `{
            day:"${day}",
            startTime:"${
              (((regularOfficeHourTimes || [])[index] || {}).timeRange || [])[0]
            }",
            endTime:"${
              (((regularOfficeHourTimes || [])[index] || {}).timeRange || [])[1]
            }",
            timezoneRegion:"${localStorage.getItem('timezone')}",
          }`;
      });
      const irregularOfficeHourDates = Object.keys(
        formData.irregularOfficeHours || []
      );
      const irregularOfficeHourTimes = Object.values(
        formData.irregularOfficeHours || []
      );
      let irregularOfficeHours = "";
      (irregularOfficeHourDates || []).forEach((date, index) => {
        if (!date) return null;
        irregularOfficeHours += `{
            date:"${((irregularOfficeHourTimes || [])[index] || {}).date}",
            startTime:"${
              (((irregularOfficeHourTimes || [])[index] || {}).timeRange || [])[0]
            }",
            endTime:"${
              (((irregularOfficeHourTimes || [])[index] || {}).timeRange || [])[1]
            }",
            timezoneRegion:"${localStorage.getItem('timezone')}",
          }`;
      });
    return {
        regularOfficeHours,
        irregularOfficeHours,
    }
}