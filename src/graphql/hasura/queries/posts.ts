import gql from 'graphql-tag';

export const GET_NEW_POSTS = gql`
  query getNewPosts {
    posts(order_by: { created_at: desc }, limit: 10) {
      id
      image
      caption
      user {
        avatar
        name
      }
    }
  }
`;
