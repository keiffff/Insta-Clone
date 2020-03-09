import gql from 'graphql-tag';

export const INSERT_FOLLOW = gql`
  mutation insertFollow($followerId: String!, $followingId: String!) {
    insert_follow(objects: { follower_id: $followerId, following_id: $followingId }) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_FOLLOW = gql`
  mutation deleteFollow($followerId: String!, $followingId: String!) {
    delete_follow(where: { follower_id: { _eq: $followerId }, following_id: { _eq: $followingId } }) {
      returning {
        id
      }
    }
  }
`;
