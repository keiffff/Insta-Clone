import React, { useCallback, useState, useRef, useMemo, ComponentProps } from 'react';
import { Button, CircularProgress, IconButton, SwipeableDrawer } from '@material-ui/core';
import { CameraAltOutlined, Telegram } from '@material-ui/icons';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { PostsList } from '../components/PostsList';
import { UsersList } from '../components/UsersList';
import { Uploader } from '../components/Uploader';
import { NewPostScreen } from '../components/NewPostScreen';
import { MenuList } from '../components/MenuList';
import { ShareDialog } from '../components/ShareDialog';
import {
  useNotifyNewPostsSubscription,
  useDeleteLikeMutation,
  useDeleteFollowMutation,
  useDeletePostMutation,
  useGetUnfollowingUsersLazyQuery,
  useInsertFollowMutation,
  useInsertLikeMutation,
  useInsertPostMutation,
} from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { paths } from '../constants/paths';
import { appUrl } from '../constants/config';

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

const Drawer = styled(SwipeableDrawer)`
  .MuiPaper-root {
    background: transparent;
  }
  .MuiDrawer-paper {
    width: 90%;
    margin: 0 auto 16px;
  }
`;

export const PostsIndex = () => {
  const history = useHistory();
  const { user: currentUser } = useAuth0();
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [deletePost] = useDeletePostMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(-1);
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleOpenDialog = useCallback(() => setDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setDialogOpen(false), []);
  const handleUploadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    setNewPostScreenVisible(true);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
  }, []);
  const [
    getUnfollowingUsers,
    { loading: getUnfollowingUsersLoading, data: getUnfollowingUsersData },
  ] = useGetUnfollowingUsersLazyQuery({
    variables: { id: currentUser.sub },
  });
  const { loading: notifyNewPostsLoading, data: notifyNewPostsData } = useNotifyNewPostsSubscription({
    variables: { userId: currentUser.sub },
    onSubscriptionData: ({ subscriptionData }) => !subscriptionData.data?.posts.length && getUnfollowingUsers(),
  });
  const [insertLike] = useInsertLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const [insertFollow] = useInsertFollowMutation();
  const [deleteFollow] = useDeleteFollowMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUserId = useMemo(() => notifyNewPostsData?.posts.find(({ id }) => id === selectedPostId)?.user.id, [
    notifyNewPostsData,
    selectedPostId,
  ]);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleDeleteFollow = useCallback(() => {
    if (!targetUserId) return;
    deleteFollow({ variables: { followingId: currentUser.sub, followerId: targetUserId } });
    setDrawerOpen(false);
  }, [currentUser, deleteFollow, targetUserId]);
  const handleDeletePost = useCallback(() => {
    deletePost({ variables: { id: selectedPostId } });
    setDrawerOpen(false);
  }, [deletePost, selectedPostId]);
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
  const handleClickPostItem = useCallback<ComponentProps<typeof PostsList>['onClick']>(
    (action, postId) => {
      const likeOptions = {
        variables: { postId, userId: currentUser.sub },
      };
      switch (action) {
        case 'openMenu':
          setDrawerOpen(true);
          setSelectedPostId(postId);
          break;
        case 'like':
          insertLike(likeOptions);
          break;
        case 'unlike':
          deleteLike(likeOptions);
          break;
        case 'comment':
          history.push(`/post/${postId}/comments`);
          break;
        default:
          break;
      }
    },
    [insertLike, deleteLike, currentUser, history],
  );
  const handleClickUserItem = useCallback<ComponentProps<typeof UsersList>['onClick']>(
    userId => insertFollow({ variables: { followingId: currentUser.sub, followerId: userId } }),
    [currentUser, insertFollow],
  );
  const menus = useMemo<ComponentProps<typeof MenuList>['menus']>(
    () => [
      targetUserId === currentUser.sub
        ? { label: '削除', dangerous: true, onClick: handleDeletePost }
        : { label: 'フォローをやめる', dangerous: true, onClick: handleDeleteFollow },
      { label: 'キャンセル', onClick: handleCloseDrawer },
    ],
    [targetUserId, currentUser, handleCloseDrawer, handleDeleteFollow, handleDeletePost],
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
          <IconButton size="small" onClick={handleOpenDialog}>
            <Telegram />
          </IconButton>
        </ShareButtonWrapper>
      </Header>
      <Content>
        {notifyNewPostsLoading || uploadFileLoading || insertPostLoading || getUnfollowingUsersLoading ? (
          <CircularProgressWrapper>
            <CircularProgress size={30} />
          </CircularProgressWrapper>
        ) : notifyNewPostsData?.posts.length ? (
          <PostsList posts={notifyNewPostsData.posts} onClick={handleClickPostItem} />
        ) : (
          <UsersList users={getUnfollowingUsersData?.users ?? []} onClick={handleClickUserItem} />
        )}
      </Content>
      <Drawer anchor="bottom" open={drawerOpen} onOpen={handleOpenDrawer} onClose={handleCloseDrawer}>
        <MenuList menus={menus} />
      </Drawer>
      <ShareDialog open={dialogOpen} onClose={handleCloseDialog} sns={['twitter', 'facebook']} url={appUrl} />
      {newPostScreenVisible ? (
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={handleCloseNewPostScreen} />
      ) : null}
    </>
  );
};
