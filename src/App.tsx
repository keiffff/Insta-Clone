import * as React from 'react';
import { useNotifyNewPostsSubscription } from './types/graphql';

export const App = () => {
  const { loading, error, data } = useNotifyNewPostsSubscription();

  return loading || error || !data ? (
    <span>no data</span>
  ) : (
    <ul>
      {data.Post.map(({ uuid, image, caption }) => (
        <li key={uuid}>
          <img src={image} alt="image" />
          <span>{caption}</span>
        </li>
      ))}
    </ul>
  );
};
