import React, { useCallback, useState, useRef, ComponentProps } from 'react';
import { Button, CircularProgress, IconButton } from '@material-ui/core';
import { CameraAltOutlined, Telegram } from '@material-ui/icons';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { PostItem } from '../components/PostItem';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import {
  useNotifyNewPostsSubscription,
  useDeleteLikeMutation,
  useInsertLikeMutation,
  useInsertPostMutation,
} from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { paths } from '../constants/paths';

const Content = styled.section`
  padding: 48px 0px 56px;
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
  padding: 8px 0px;
`;

const UploadButtonWrapper = styled.div`
  margin-left: 12px;
`;

const LogoButtonWrapper = styled.div`
  margin: auto;
`;

const ShareButtonWrapper = styled.div`
  margin-right: 12px;
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
  const { user: currentUser } = useAuth0();
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const handleUploadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    setNewPostScreenVisible(true);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
  }, []);
  const { loading: notifyNewPostsLoading, data: notifyNewPostsData } = useNotifyNewPostsSubscription({
    variables: { userId: currentUser.sub },
  });
  const [insertLike] = useInsertLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleSubmitNewPost = useCallback(
    async (caption: string) => {
      setNewPostScreenVisible(false);
      const { data } = await uploadFile({ variables: { file } });
      if (!data?.uploadFile) return;
      insertPost({
        variables: { image: data.uploadFile, caption, userId: currentUser.sub },
      });
      setPreviewUrl('');
      history.push(paths.home);
    },
    [insertPost, file, uploadFile, currentUser, history],
  );
  const handleCloseNewPostScreen = useCallback(() => {
    setPreviewUrl('');
    setNewPostScreenVisible(false);
  }, []);
  const handleClickLogo = useCallback(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), []);
  const handleClickPostItem = useCallback<ComponentProps<typeof PostItem>['onClick']>(
    (action, postId) => {
      const likeOptions = {
        variables: { postId, userId: currentUser.sub },
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

  return (
    <>
      <Header>
        <UploadButtonWrapper>
          <Uploader ref={fileInputRef} onUpload={handleUploadFile} capture="environment">
            <IconButton size="small" onClick={handleClickUploadButton}>
              <CameraAltOutlined />
            </IconButton>
          </Uploader>
        </UploadButtonWrapper>
        <LogoButtonWrapper>
          <Button onClick={handleClickLogo}>
            <Logo src="./assets/images/logo.png" alt="logo" />
          </Button>
        </LogoButtonWrapper>
        <ShareButtonWrapper>
          <IconButton size="small">
            <Telegram />
          </IconButton>
        </ShareButtonWrapper>
      </Header>
      <Content>
        {notifyNewPostsLoading || uploadFileLoading || insertPostLoading ? (
          <CircularProgressWrapper>
            <CircularProgress size={30} />
          </CircularProgressWrapper>
        ) : (
          <List>
            {notifyNewPostsData?.posts.map(({ id, caption, image, user, likes }) => (
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
      </Content>
      {newPostScreenVisible ? (
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={handleCloseNewPostScreen} />
      ) : null}
    </>
  );
};
