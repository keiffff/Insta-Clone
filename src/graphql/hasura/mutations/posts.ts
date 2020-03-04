import gql from 'graphql-tag';

export const INSERT_POST = gql`
  mutation insertPost($image: String!, $caption: String!, $userId: String!) {
    insert_posts(objects: { image: $image, caption: $caption, user_id: $userId }) {
      returning {
        id
        image
        caption
        user {
          avatar
          name
        }
      }
    }
  }
`;
