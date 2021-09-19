import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga'
import './index.css';

import App from './App';
import {register} from './serviceWorker';
import {reducer as formReducer}  from 'redux-form'
import rootSaga from './store/sagas/index'

import studentCourseReducer from './store/reducers/student/course';
import studentLessonReducer from './store/reducers/student/lesson';
import studentTestReducer from './store/reducers/student/test';

import instructorCourseReducer from './store/reducers/instructor/course';
import instructorLessonReducer from './store/reducers/instructor/lesson';
import instructorModulesReducer from './store/reducers/instructor/modules';
import instructorTestReducer from './store/reducers/instructor/test';
import instructorQuestionReducer from './store/reducers/instructor/question';
import instructorStudentReducer from './store/reducers/instructor/student';

import authenticationReducer from './store/reducers/authentication/authentication'
import commonReducer from './store/reducers/common/common'

import transactionsReducer from './store/reducers/transactions/transactions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    studentCourse: studentCourseReducer,
    studentLesson:studentLessonReducer,
    studentTest:studentTestReducer,

    instructorCourse: instructorCourseReducer,
    instructorLesson:instructorLessonReducer,
    instructorModules:instructorModulesReducer,
    instructorTest:instructorTestReducer,
    instructorQuestion:instructorQuestionReducer,
    instructorStudent:instructorStudentReducer,
    
    authentication: authenticationReducer,
    common: commonReducer,
    transactions: transactionsReducer,
    form: formReducer,
});

export const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(sagaMiddleware)
));
sagaMiddleware.run(rootSaga)

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
register();