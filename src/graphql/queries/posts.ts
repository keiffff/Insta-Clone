import gql from 'graphql-tag';

export const GET_NEW_POSTS = gql`
  query getNewPosts {
    Post(order_by: { created_at: desc }, limit: 10) {
      uuid
      image
      caption
      User {
        avatar
        name
      }
    }
  }
`;
