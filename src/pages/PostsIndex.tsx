import React, { useCallback, useState, useRef, ComponentProps } from 'react';
import { Button, CircularProgress, IconButton } from '@material-ui/core';
import { CameraAltOutlined, Telegram } from '@material-ui/icons';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { PostItem } from '../components/PostItem';
import { PageFooter } from '../components/PageFooter';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import {
  GetNewPostsDocument,
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
  padding: 8px;
`;

const UploadButtonWrapper = styled.div`
  margin-left: 12px;
`;

const ShareButtonWrapper = styled.div`
  margin-right: 12px;
`;

const LogoButtonWrapper = styled.div`
  margin: auto;
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
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const [insertLike] = useInsertLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const handleClickLogo = useCallback(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), []);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleUploadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
    setNewPostScreenVisible(true);
  }, []);
  const handleCloseNewPostScreen = useCallback(() => setNewPostScreenVisible(false), []);
  const handleSubmitNewPost = useCallback(
    async (caption: string) => {
      setNewPostScreenVisible(false);
      const { data: uploadFileData } = await uploadFile({ variables: { file } });
      if (!uploadFileData?.uploadFile) return;
      insertPost({
        variables: { image: uploadFileData.uploadFile, caption, userId: currentUser.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: currentUser.sub } }],
      });
    },
    [uploadFile, insertPost, currentUser, file],
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
        {getNewPostsLoading || insertPostLoading || uploadFileLoading ? (
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
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={handleCloseNewPostScreen} />
      ) : null}
    </>
  );
};
