import React from 'react'
import PropTypes from 'prop-types'
import Table from './table'

const TaskTable = ({ children, getFooter, ...props }) => {
    return (<Table selectable={false} {...props}>
        {({
            Wrapper,
            Header,
            Body,
            HeaderColumn,
            Row,
            RowColumn,
            Footer,
        }) => {
            return (
                <Wrapper selectable={false} {...props}>
                    <Header displaySelectAll={false} adjustForCheckbox={false}>
                        <Row>
                            <HeaderColumn>Task</HeaderColumn>
                            <HeaderColumn>Pomodoros</HeaderColumn>
                            <HeaderColumn>Actions</HeaderColumn>
                        </Row>
                    </Header>
                    {children({
                        Row,
                        RowColumn,
                        Body,
                    })}
                    {getFooter ?
                        <Footer displayRowCheckbox={false}>
                            <Row>
                                <RowColumn />
                                <RowColumn style={{ textAlign: 'left' }}>
                                    {getFooter()}
                                </RowColumn>
                                <RowColumn />
                            </Row>
                        </Footer>
                        : null}
                </Wrapper>
            )
        }}
    </Table>)
}

TaskTable.propTypes = {
    children: PropTypes.func.isRequired,
    getFooter: PropTypes.func,
}

export default TaskTable
