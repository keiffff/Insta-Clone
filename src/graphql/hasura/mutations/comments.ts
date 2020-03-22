import gql from 'graphql-tag';

export const INSERT_COMMENT = gql`
  mutation insertComment($userId: String!, $postId: Int!, $comment: String!) {
    insert_comments(objects: { user_id: $userId, post_id: $postId, comment: $comment }) {
      returning {
        id
      }
    }
  }
`;
