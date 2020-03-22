import gql from 'graphql-tag';

export const GET_COMMENTS = gql`
  query getComments($postId: Int!) {
    comments(where: { post_id: { _eq: $postId } }, order_by: { created_at: desc }, limit: 20) {
      id
      comment
      created_at
    }
  }
`;
