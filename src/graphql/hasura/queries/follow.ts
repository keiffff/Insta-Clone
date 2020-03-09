import gql from 'graphql-tag';

export const GET_FOLLOW = gql`
  query getFollow($followingId: String!, $followerId: String!) {
    follow(where: { following_id: { _eq: $followingId }, follower_id: { _eq: $followerId } }) {
      id
    }
  }
`;
