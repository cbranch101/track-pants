
import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default function uiDecorator(story) {
  return (
    <MuiThemeProvider>
      {story()}
    </MuiThemeProvider>
  )
}
