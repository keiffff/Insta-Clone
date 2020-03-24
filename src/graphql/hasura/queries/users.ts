import gql from 'graphql-tag';

export const GET_PROFILE_INFO = gql`
  query getProfileInfo($id: String!) {
    users(where: { id: { _eq: $id } }) {
      name
      avatar
      description
      posts(order_by: { created_at: desc }) {
        id
        image
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_USERS_INFO = gql`
  query getUsersInfo($id: String!) {
    users_by_pk(id: $id) {
      name
      avatar
    }
  }
`;

export const GET_USERS_AVATAR = gql`
  query getUsersAvatar($id: String!) {
    users(where: { id: { _eq: $id } }) {
      avatar
    }
  }
`;

export const GET_USERS_EDITABLE_INFO = gql`
  query getUsersEditableInfo($id: String!) {
    users(where: { id: { _eq: $id } }) {
      name
      avatar
      description
    }
  }
`;

export const GET_UNFOLLOWING_USERS = gql`
  query getUnfollowingUsers($id: String!) {
    users(where: { followsByFollowingId: { _not: { following_id: { _eq: $id } } } }, limit: 20) {
      id
      avatar
      name
    }
  }
`;
