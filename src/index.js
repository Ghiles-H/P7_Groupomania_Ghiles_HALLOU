import React from 'react';
import ReactDOM from 'react-dom';
import {  Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import './styles/index.scss'
import rootReducer from './reducers'
import {composeWithDevTools} from 'redux-devtools-extension';
import { getUsers } from './actions/users.actions';
import { getPosts } from './actions/post.actions';

require('dotenv').config({path: '../.env'});
export const url_api = "http://localhost:8080";
export const url_api_env = process.env.REACT_APP_API_URL;

const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(thunk))
)

store.dispatch(getUsers());
store.dispatch(getPosts());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,  
  document.getElementById('root')
);

