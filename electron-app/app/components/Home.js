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
    data: React.PropTypes.shape({
      testData: React.PropTypes.shape({
        foo: React.PropTypes.string,
        bar: React.PropTypes.string,
      }),
      loading: React.PropTypes.bool,
    })
  }
  handleSubmit = (values) => {
    console.log(values);
  }
  render() {
    const { handleSubmit } = this.props;
    const { testData, loading } = this.props.data;
    if (loading) return <div>Loading</div>;
    return (

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text" />
        </div>
        <RaisedButton type="submit">Submit</RaisedButton>
      </form>
    );
  }
}

const MyQuery = gql`query MyQuery { testData { foo, bar } }`;

const FormComponent = reduxForm({
  form: 'test',
})(TestComponent);


const TestComponentWithData = graphql(MyQuery)(FormComponent);

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <TestComponentWithData />
        </div>
      </div>
    );
  }
}
