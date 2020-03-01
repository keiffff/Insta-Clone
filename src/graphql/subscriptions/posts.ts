import gql from 'graphql-tag';

export const NOTIFY_NEW_POSTS = gql`
  subscription notifyNewPosts {
    Post(order_by: { created_at: desc }, limit: 10) {
      uuid
      user_uuid
      image
      created_at
      caption
    }
  }
`;
