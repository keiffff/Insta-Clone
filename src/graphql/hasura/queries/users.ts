import gql from 'graphql-tag';

export const GET_USERS_POST = gql`
  query getUsersInfo($id: String!) {
    users(where: { id: { _eq: $id } }) {
      name
      avatar
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
