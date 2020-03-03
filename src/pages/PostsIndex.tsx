import React, { useCallback, useRef, useState } from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { PostItem } from '../components/PostItem';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import { useGetNewPostsQuery, useUploadFileMutation, useInsertPostMutation } from '../types/graphql';

const Page = styled.div`
  padding-top: 45px;
  display: flex;
  justify-content: center;
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
  padding: 12px;
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
  const { loading: notifyNewPostsLoading, data: getNewPostsData } = useGetNewPostsQuery();
  const [uploadFile, { loading: uploadFileLoading, data: uploadFileData }] = useUploadFileMutation();
  const [insertPost] = useInsertPostMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const handleClickAddButton = useCallback(() => fileInputRef.current?.click(), []);
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
      // userUuidは一旦仮で入れている
      insertPost({ variables: { image: imageUrl, caption, userUuid: '35543404-7dfe-4e5a-9e57-6fe29c9704ef' } });
      setNewPostScreenVisible(false);
    },
    [insertPost],
  );

  return (
    <>
      <Page>
        <Header>
          <Logo src="./assets/images/logo.png" alt="logo" />
        </Header>
        {notifyNewPostsLoading ? (
          <CircularProgressWrapper>
            <CircularProgress size={30} />
          </CircularProgressWrapper>
        ) : (
          <List>
            {getNewPostsData?.Post.map(({ uuid, caption, image, User }) => (
              <li key={uuid}>
                <PostItem image={image} caption={caption} user={User} />
              </li>
            )) || null}
          </List>
        )}
        <Footer>
          <AddButtonWrapper>
            <Uploader ref={fileInputRef} onUpload={handleUploadFile}>
              <IconButton size="small" onClick={handleClickAddButton}>
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
