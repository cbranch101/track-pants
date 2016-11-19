// @flow
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import { RaisedButton } from 'material-ui';
import styles from './Home.css';


const TestComponent = (props, isLoading) => {
  const { testData, loading } = props.data;
  if (loading) return <div>Loading</div>;
  return (
    <RaisedButton>{testData.bar}</RaisedButton>
  );
};

TestComponent.propTypes = {
  testData: React.PropTypes.shape({
    foo: React.PropTypes.string,
    bar: React.PropTypes.string,
  }),
};

const MyQuery = gql`query MyQuery { testData { foo, bar } }`;

const TestComponentWithData = graphql(MyQuery)(TestComponent);

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link>
          <TestComponentWithData />
        </div>
      </div>
    );
  }
}
