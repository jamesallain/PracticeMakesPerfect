import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)
const app = document.createElement('div');
document.body.appendChild(app);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  app
)