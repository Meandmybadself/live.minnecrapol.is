import React from 'react'
import { render } from 'react-dom'

import '../stylesheets/index.scss'

import MinnecrapolisLive from './components/minnecrapolis-live.js'

render(
  <MinnecrapolisLive />,
  document.getElementById('minnecrapolis-live')
)