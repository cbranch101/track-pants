import PropTypes from 'prop-types'
import {
    Table as Wrapper,
    TableBody as Body,
    TableHeader as Header,
    TableHeaderColumn as HeaderColumn,
    TableRowColumn as RowColumn,
    TableFooter as Footer
} from 'material-ui/Table'

import Row from './table-row'

const Table = ({ children }) => {
    return children({
        Wrapper,
        Body,
        Header,
        HeaderColumn,
        Row,
        Footer,
        RowColumn
    })
}

Table.propTypes = {
    children: PropTypes.func.isRequired
}

export default Table
