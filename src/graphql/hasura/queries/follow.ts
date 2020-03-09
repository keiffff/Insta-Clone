import gql from 'graphql-tag';

export const GET_FOLLOW_INFO = gql`
  query getFollowInfo($followingId: String!, $followerId: String!) {
    follow(where: { following_id: { _eq: $followingId }, follower_id: { _eq: $followerId } }) {
      id
    }
    followingCount: follow_aggregate(where: { following_id: { _eq: $followerId } }) {
      aggregate {
        count
      }
    }
    followersCount: follow_aggregate(where: { follower_id: { _eq: $followerId } }) {
      aggregate {
        count
      }
    }
  }
`;
