import gql from 'graphql-tag';

export const GET_COMMENTS = gql`
  fragment userInfo on users {
    avatar
    name
  }

  query getComments($postId: Int!) {
    posts_by_pk(id: $postId) {
      caption
      user {
        ...userInfo
      }
    }
    comments(where: { post_id: { _eq: $postId } }, order_by: { created_at: desc }, limit: 20) {
      id
      comment
      created_at
      user {
        ...userInfo
      }
    }
  }
`;
