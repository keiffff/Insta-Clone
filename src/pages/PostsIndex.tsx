import React, { useCallback, useRef, useState } from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { AddBoxOutlined, Close } from '@material-ui/icons';
import styled from 'styled-components';
import { PostItem } from '../components/PostItem';
import { Uploader } from '../components/Uploader';
import { useNotifyNewPostsSubscription, useUploadFileMutation } from '../types/graphql';

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

const NewPostScreen = styled(Page)`
  width: 100%;
  height: 100%;
  z-index: 1200;
  position: fixed;
  top: 0;
  left: 0;
  background: #fafafa;
`;

const NewPostScreenHeader = styled(Header)`
  padding: 7px;
`;

const NewPostScreenHeaderTitle = styled.h1`
  font-size: 14px;
  margin: 0 auto;
  line-height: 1.4;
`;

const CONTAINER_HEIGHT = 144;

const NewPostContainer = styled.div`
  width: 100%;
  height: ${CONTAINER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding: 8px;
  margin-left: 8px;
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
`;

const UploadedImage = styled.img`
  width: ${CONTAINER_HEIGHT}px;
  height: ${CONTAINER_HEIGHT}px;
`;

const NewPostCaption = styled.textarea`
  width: calc(100% - ${CONTAINER_HEIGHT}px);
  height: ${CONTAINER_HEIGHT}px;
  padding: 0;
  outline: none;
  font-size: 14px;
  resize: none;
`;

export const PostsIndex = () => {
  const { loading: notifyNewPostsLoading, data: notifyNewPostsData } = useNotifyNewPostsSubscription();
  const [uploadFile, { loading: uploadFileLoading, data: uploadFileData }] = useUploadFileMutation();
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
            {notifyNewPostsData?.Post.map(({ uuid, caption, image, User }) => (
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
        <NewPostScreen>
          <NewPostScreenHeader>
            <IconButton size="small" onClick={handleCloseNewPostScreen}>
              <Close />
            </IconButton>
            <NewPostScreenHeaderTitle>新しい写真投稿</NewPostScreenHeaderTitle>
          </NewPostScreenHeader>
          {uploadFileLoading ? (
            <CircularProgressWrapper>
              <CircularProgress size={30} />
            </CircularProgressWrapper>
          ) : uploadFileData?.uploadFile ? (
            <NewPostContainer>
              <UploadedImage src={uploadFileData.uploadFile} alt="uploaded-image" />
              <NewPostCaption placeholder="キャプションを書く" />
            </NewPostContainer>
          ) : null}
        </NewPostScreen>
      ) : null}
    </>
  );
};
