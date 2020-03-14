import gql from 'graphql-tag';

export const UPDATE_USER = gql`
  mutation updateUser($id: String!, $attributes: users_set_input!) {
    update_users(where: { id: { _eq: $id } }, _set: $attributes) {
      returning {
        id
      }
    }
  }
`;
