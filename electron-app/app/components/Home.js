// @flow
import gql from 'graphql-tag';
import { Field, reduxForm } from 'redux-form';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import { RaisedButton } from 'material-ui';

import styles from './Home.css';


class TestComponent extends Component {
    static propTypes = {
        handleSubmit: React.PropTypes.func.isRequired,
        submit: React.PropTypes.func.isRequired,
        data: React.PropTypes.shape({
            testData: React.PropTypes.shape({
                foo: React.PropTypes.string,
                bar: React.PropTypes.string,
            }),
            loading: React.PropTypes.bool,
        })
    }
    handleSubmit = async (values) => {
        this.props.mutate({ variables: { name: values.name } })
    }
    render() {
        const { handleSubmit, loading } = this.props;
        if (loading) return <div>Loading</div>;
        return (

            <form onSubmit={handleSubmit(this.handleSubmit)}>
                <div>
                    <label htmlFor="name">First Name</label>
                    <Field name="name" component="input" type="text" />
                </div>
                <RaisedButton type="submit">Submit</RaisedButton>
            </form>
        );
    }
}

const MyQuery = gql`query MyQuery { widget { name } }`;
const MyMutation = gql`
    mutation UpdateWidget($name: String) {
      setWidgetName(name: $name) {
        name
      }
    }
`;

const TestComponentWithForm = reduxForm({
    form: 'test',
    enableReinitialize: true,
})(TestComponent)


const TestComponentWithData = graphql(MyQuery, {
    props: ({ data: { widget, loading } }) => {
        return {
            initialValues: widget,
            loading,
        }
    }
})(TestComponentWithForm)

const TestComponentWithMutation = graphql(MyMutation)(TestComponentWithData)


export default class Home extends Component {
    render() {
        return (
            <div>
                <div className={styles.container}>
                    <TestComponentWithMutation />
                </div>
            </div>
        );
    }
}
