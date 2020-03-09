import React, { useCallback, useState, useMemo, ComponentProps } from 'react';
import styled from 'styled-components';
import { Button, IconButton, List, ListItem, SwipeableDrawer } from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { PageFooter } from '../components/PageFooter';
import { NewPostScreen } from '../components/NewPostScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import {
  GetFollowDocument,
  GetUsersInfoDocument,
  GetNewPostsDocument,
  useDeleteFollowMutation,
  useInsertFollowMutation,
  useInsertPostMutation,
  useGetUsersInfoQuery,
  useGetFollowQuery,
} from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { useAuth0 } from '../providers/Auth0';
import { paths } from '../constants/paths';

const Page = styled.div`
  padding-top: 48px;
  display: flex;
  background: #ffffff;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid #dbdbdb;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
  padding: 8px;
`;

const BackButtonWrapper = styled.div`
  margin-left: 12px;
`;

const UserNameLabel = styled.span`
  display: inline-flex;
  margin: auto;
  font-weight: bold;
`;

const MenuButtonWrapper = styled.div`
  margin-right: 12px;
`;

const UsersProfile = styled.div`
  padding: 12px;
  border-bottom: 1px solid #dbdbdb;
`;

const UsersInfo = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 25%;
  height: 25%;
  border-radius: 50%;
`;

const Summary = styled.div`
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Cell = styled.div`
  & + & {
    margin-left: 24px;
  }
`;

const CellValue = styled.span`
  display: block;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: elipsis;
`;

const CellLabel = styled.label`
  display: block;
  text-align: center;
  font-size: 14px;
`;

const EditProfileButton = styled(Button)`
  width: 100%;
  .MuiButton-label {
    font-weight: bold;
  }
`;

const FollowButton = styled(Button)`
  width: 100%;
  .MuiButton-label {
    font-weight: bold;
  }
`;

const UsersPosts = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const PostImage = styled.img`
  width: calc(100% / 3);
`;

const DrawerHandle = styled.span`
  display: inline-flex;
  width: 20%;
  padding: 4px;
  margin: 8px auto 0px;
  background: #dbdbdb;
  border-radius: 4px;
`;

export const Profile = () => {
  const history = useHistory();
  const location = useLocation();
  const { id: userId } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuth0();
  const { loading: getUsersInfoLoading, data: getUsersInfoData } = useGetUsersInfoQuery({
    variables: { id: userId },
  });
  const { loading: getFollowLoading, data: getFollowData } = useGetFollowQuery({
    variables: { followingId: currentUser.sub, followerId: userId },
  });
  const [insertFollow] = useInsertFollowMutation({
    variables: { followingId: currentUser.sub, followerId: userId },
    refetchQueries: [
      { query: GetUsersInfoDocument, variables: { id: userId } },
      { query: GetUsersInfoDocument, variables: { id: currentUser.sub } },
      { query: GetFollowDocument, variables: { followingId: currentUser.sub, followerId: userId } },
    ],
  });
  const [deleteFollow] = useDeleteFollowMutation({
    variables: { followingId: currentUser.sub, followerId: userId },
    refetchQueries: [
      { query: GetUsersInfoDocument, variables: { id: userId } },
      { query: GetUsersInfoDocument, variables: { id: currentUser.sub } },
      { query: GetFollowDocument, variables: { followingId: currentUser.sub, followerId: userId } },
    ],
  });
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const viewingSelf = useMemo(() => currentUser.sub === userId, [currentUser, userId]);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleClickLogout = useCallback(() => logout({ returnTo: window.location.origin }), [logout]);
  const handleCloseNewPostScreen = useCallback(() => setNewPostScreenVisible(false), []);
  const handleInsertFollow = useCallback(() => insertFollow(), [insertFollow]);
  const handleDeleteFollow = useCallback(() => deleteFollow(), [deleteFollow]);
  const handleSubmitNewPost = useCallback(
    async (caption: string) => {
      setNewPostScreenVisible(false);
      const { data: uploadFileData } = await uploadFile({ variables: { file } });
      if (!uploadFileData?.uploadFile) return;
      insertPost({
        variables: { image: uploadFileData.uploadFile, caption, userId: currentUser.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: currentUser.sub } }],
      });
      history.push(paths.home);
    },
    [uploadFile, insertPost, currentUser, file, history],
  );
  const handleUploadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
    setNewPostScreenVisible(true);
  }, []);
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

  return getUsersInfoLoading || getFollowLoading || uploadFileLoading || insertPostLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Page>
        <Header>
          <BackButtonWrapper>
            <IconButton size="small" onClick={() => handleClickPageFooter('home')}>
              <ChevronLeft />
            </IconButton>
          </BackButtonWrapper>
          <UserNameLabel>{getUsersInfoData?.users[0].name ?? ''}</UserNameLabel>
          <MenuButtonWrapper>
            <IconButton size="small" onClick={handleOpenDrawer}>
              <Menu />
            </IconButton>
          </MenuButtonWrapper>
        </Header>
        <div>
          <UsersProfile>
            <UsersInfo>
              <Avatar src={getUsersInfoData?.users[0].avatar} />
              <Summary>
                <Cell>
                  <CellValue>{getUsersInfoData?.users[0].posts_aggregate.aggregate?.count ?? 0}</CellValue>
                  <CellLabel>投稿</CellLabel>
                </Cell>
                <Cell>
                  <CellValue>
                    {getUsersInfoData?.users[0].followsByFollowerId_aggregate.aggregate?.count ?? 0}
                  </CellValue>
                  <CellLabel>フォロワー</CellLabel>
                </Cell>
                <Cell>
                  <CellValue>
                    {getUsersInfoData?.users[0].followsByFollowingId_aggregate.aggregate?.count ?? 0}
                  </CellValue>
                  <CellLabel>フォロー中</CellLabel>
                </Cell>
              </Summary>
            </UsersInfo>
            {viewingSelf ? (
              <EditProfileButton variant="outlined">プロフィールを編集</EditProfileButton>
            ) : getFollowData?.follow.length ? (
              <FollowButton variant="outlined" onClick={handleDeleteFollow}>
                フォローをやめる
              </FollowButton>
            ) : (
              <FollowButton variant="outlined" onClick={handleInsertFollow}>
                フォローする
              </FollowButton>
            )}
          </UsersProfile>
          <UsersPosts>
            {getUsersInfoData?.users[0].posts.map(({ id, image }) => <PostImage key={id} src={image} />) || null}
          </UsersPosts>
        </div>
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
      <SwipeableDrawer anchor="bottom" open={drawerOpen} onOpen={handleOpenDrawer} onClose={handleCloseDrawer}>
        <DrawerHandle />
        <List>
          <ListItem button onClick={handleClickLogout}>
            ログアウト
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
};
