import { configure } from '@kadira/storybook'
import injectTapEventPlugin from 'react-tap-event-plugin'

function loadStories() {
    injectTapEventPlugin()
    require('../stories')
}

configure(loadStories, module)
