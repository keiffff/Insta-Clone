import gql from 'graphql-tag';

export const GET_NEW_POSTS = gql`
  query getNewPosts($userId: String!) {
    posts(order_by: { created_at: desc }, limit: 10) {
      id
      image
      caption
      likes(where: { user_id: { _eq: $userId } }) {
        id
      }
      user {
        avatar
        name
      }
    }
  }
`;
