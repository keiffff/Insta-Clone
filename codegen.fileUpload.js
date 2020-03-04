module.exports = {
  schema: 'https://image-processor.now.sh',
  documents: './src/graphql/fileUpload/fileUpload.ts',
  overwrite: true,
  generates: {
    './src/types/fileUpload.ts': {
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
