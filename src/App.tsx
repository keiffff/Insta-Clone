import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { PostsIndex } from './pages/PostsIndex';

export const App = () => (
  <BrowserRouter>
    <Route path="/">
      <PostsIndex />
    </Route>
  </BrowserRouter>
);
