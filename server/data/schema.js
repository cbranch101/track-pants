const typeDefinitions = `
type TestData {
    foo: String,
    bar: String,
}

type Query {
  testData: TestData
}
schema {
  query: Query
}
`;

export default [typeDefinitions];
