import React, { useCallback, useState, useRef, ComponentProps } from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { CameraAltOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { PostItem } from '../components/PostItem';
import { PageFooter } from '../components/PageFooter';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import {
  GetNewPostsDocument,
  GetNewPostsQuery,
  useDeleteLikeMutation,
  useGetNewPostsQuery,
  useInsertPostMutation,
  useInsertLikeMutation,
} from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { paths } from '../constants/paths';

const Page = styled.div`
  padding: 48px 0px 80px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Header = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
  padding: 8px 0px 8px 8px;
`;

const Logo = styled.img`
  width: 100px;
  margin: auto;
`;

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
`;

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const PostsIndex = () => {
  const history = useHistory();
  const location = useLocation();
  const { user: currentUser } = useAuth0();
  const { loading: getNewPostsLoading, data: getNewPostsData } = useGetNewPostsQuery({
    variables: { userId: currentUser.sub },
  });
  const [uploadFile, { loading: uploadFileLoading, data: uploadFileData }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const [insertLike] = useInsertLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleUploadFile = useCallback(
    (file: File) => {
      uploadFile({ variables: { file } });
      setNewPostScreenVisible(true);
    },
    [uploadFile],
  );
  const handleCloseNewPostScreen = useCallback(() => setNewPostScreenVisible(false), []);
  const handleSubmitNewPost = useCallback(
    (imageUrl: string, caption: string) => {
      insertPost({
        variables: { image: imageUrl, caption, userId: currentUser.sub },
        update(cache, { data }) {
          const existingPostsData = cache.readQuery<GetNewPostsQuery>({ query: GetNewPostsDocument });
          cache.writeQuery({
            query: GetNewPostsDocument,
            data: {
              posts: [...(data?.insert_posts?.returning ?? []), ...(existingPostsData?.posts ?? [])],
            },
          });
        },
      });
      setNewPostScreenVisible(false);
    },
    [insertPost, currentUser],
  );
  const handleClickPostItem = useCallback<ComponentProps<typeof PostItem>['onClick']>(
    (action, postId) => {
      const likeOptions = {
        variables: { postId, userId: currentUser.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: currentUser.sub } }],
      };
      switch (action) {
        case 'like':
          insertLike(likeOptions);
          break;
        case 'unlike':
          deleteLike(likeOptions);
          break;
        default:
          break;
      }
    },
    [insertLike, deleteLike, currentUser],
  );
  const handleClickPageFooter = useCallback<ComponentProps<typeof PageFooter>['onClick']>(
    action => {
      switch (action) {
        case 'home':
          history.push(paths.home);
          break;
        case 'profile':
          history.push(`${paths.profile}/${currentUser.sub}`);
          break;
        default:
          break;
      }
    },
    [history, currentUser],
  );

  return (
    <>
      <Page>
        <Header>
          <Uploader ref={fileInputRef} onUpload={handleUploadFile} capture="environment">
            <IconButton size="small" onClick={handleClickUploadButton}>
              <CameraAltOutlined />
            </IconButton>
          </Uploader>
          <Logo src="./assets/images/logo.png" alt="logo" />
        </Header>
        {getNewPostsLoading || insertPostLoading ? (
          <CircularProgressWrapper>
            <CircularProgress size={30} />
          </CircularProgressWrapper>
        ) : (
          <List>
            {getNewPostsData?.posts.map(({ id, caption, image, user, likes }) => (
              <li key={id}>
                <PostItem
                  id={id}
                  image={image}
                  caption={caption}
                  user={user}
                  liked={likes.length > 0}
                  onClick={handleClickPostItem}
                />
              </li>
            )) || null}
          </List>
        )}
        <PageFooter
          user={{ id: currentUser.sub, avatar: currentUser.picture }}
          currentPath={location.pathname}
          onClick={handleClickPageFooter}
          onUploadFile={handleUploadFile}
        />
      </Page>
      {newPostScreenVisible ? (
        <NewPostScreen
          imageUrl={uploadFileData?.uploadFile || ''}
          loading={uploadFileLoading}
          onSubmit={handleSubmitNewPost}
          onClose={handleCloseNewPostScreen}
        />
      ) : null}
    </>
  );
};
