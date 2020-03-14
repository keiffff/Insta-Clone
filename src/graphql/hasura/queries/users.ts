import gql from 'graphql-tag';

export const GET_USERS_INFO = gql`
  query getUsersInfo($id: String!) {
    users(where: { id: { _eq: $id } }) {
      name
      avatar
      description
      posts(order_by: { created_at: desc }) {
        id
        image
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_USERS_AVATAR = gql`
  query getUsersAvatar($id: String!) {
    users(where: { id: { _eq: $id } }) {
      avatar
    }
  }
`;

export const GET_USERS_EDITABLE_INFO = gql`
  query getUsersEditableInfo($id: String!) {
    users(where: { id: { _eq: $id } }) {
      name
      avatar
      description
    }
  }
`;
