import gql from 'graphql-tag';

export const INSERT_LIKE = gql`
  mutation insertLike($postId: Int!, $userId: String!) {
    insert_likes(objects: { post_id: $postId, user_id: $userId }) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_LIKE = gql`
  mutation deleteLike($postId: Int!, $userId: String!) {
    delete_likes(where: { post_id: { _eq: $postId }, user_id: { _eq: $userId } }) {
      returning {
        id
      }
    }
  }
`;
