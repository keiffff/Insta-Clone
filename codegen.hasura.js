module.exports = {
  schema: [
    {
      'https://insta-clone-sample.herokuapp.com/v1/graphql': {
        headers: {
          Authorization: 'Bearer' + process.env.AUTH_TOKEN,
        },
      },
    },
  ],
  documents: './src/graphql/hasura/**/*.ts',
  overwrite: true,
  generates: {
    './src/types/hasura.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        namingConvention: {
          transformUnderscore: true,
        },
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};
