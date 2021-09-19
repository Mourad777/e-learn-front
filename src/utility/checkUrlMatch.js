import { matchPath } from "react-router-dom";

export const checkMatch = (location, path, exact) => {
    return !!matchPath(location, {
        path,
        exact: exact || false,
    })
}