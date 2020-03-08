import React, { useCallback, useRef, useState } from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { AddBoxOutlined, CameraAltOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { useAuth0 } from '../providers/Auth0';
import { PostItem } from '../components/PostItem';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import { GetNewPostsDocument, GetNewPostsQuery, useGetNewPostsQuery, useInsertPostMutation } from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';

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

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 8px;
`;

const AddButtonWrapper = styled.div`
  margin: auto;
`;

export const PostsIndex = () => {
  const { user: currentUser } = useAuth0();
  const { loading: getNewPostsLoading, data: getNewPostsData } = useGetNewPostsQuery();
  const [uploadFile, { loading: uploadFileLoading, data: uploadFileData }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
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
            {getNewPostsData?.posts.map(({ id, caption, image, user }) => (
              <li key={id}>
                <PostItem image={image} caption={caption} user={user} />
              </li>
            )) || null}
          </List>
        )}
        <Footer>
          <AddButtonWrapper>
            <Uploader ref={fileInputRef} onUpload={handleUploadFile}>
              <IconButton size="small" onClick={handleClickUploadButton}>
                <AddBoxOutlined />
              </IconButton>
            </Uploader>
          </AddButtonWrapper>
        </Footer>
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
