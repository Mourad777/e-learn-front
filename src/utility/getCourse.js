export const getCourse = (courses,courseId) => {
    if(!courses)return {
        tests:[],
        lessons:[],
    };
    const course = courses.find(c=>c._id === courseId)
    return course||{}
}