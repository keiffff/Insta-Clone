import gql from 'graphql-tag';

export const INSERT_POST = gql`
  mutation insertPost($image: String!, $caption: String!, $userUuid: uuid!) {
    insert_Post(objects: { image: $image, caption: $caption, user_uuid: $userUuid }) {
      affected_rows
      returning {
        uuid
        image
        caption
        User {
          avatar
          name
        }
      }
    }
  }
`;
