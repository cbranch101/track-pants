import injectTapEventPlugin from 'react-tap-event-plugin'
import React, { Component, PropTypes } from 'react'

injectTapEventPlugin()
export default class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
