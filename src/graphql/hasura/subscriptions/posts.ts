import gql from 'graphql-tag';

export const NOTIFY_NEW_POSTS = gql`
  subscription notifyNewPosts($userId: String!) {
    posts(
      order_by: { created_at: desc }
      limit: 10
      where: {
        _or: [{ user: { followsByFollowerId: { following_id: { _eq: $userId } } } }, { user_id: { _eq: $userId } }]
      }
    ) {
      id
      image
      caption
      created_at
      likes(where: { user_id: { _eq: $userId } }) {
        id
      }
      user {
        id
        avatar
        name
      }
      comments {
        id
        user {
          name
        }
        comment
      }
    }
  }
`;
