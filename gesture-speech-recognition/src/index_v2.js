import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.css'
import '../node_modules/react-vis/dist/style.css'

import { StateProvider } from './Context'

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>
  , document.getElementById('root'))
