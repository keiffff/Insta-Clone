import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Button, IconButton, List, ListItem, SwipeableDrawer } from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import {
  GetFollowInfoDocument,
  useDeleteFollowMutation,
  useInsertFollowMutation,
  useGetUsersInfoQuery,
  useGetFollowInfoQuery,
} from '../types/hasura';
import { useAuth0 } from '../providers/Auth0';
import { paths } from '../constants/paths';

const Content = styled.section`
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
  background: #ffffff;
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
  padding-bottom: 56px;
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
  const { id: userId } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuth0();
  const { loading: getUsersInfoLoading, data: getUsersInfoData } = useGetUsersInfoQuery({
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
  });
  const { loading: getFollowInfoLoading, data: getFollowInfoData } = useGetFollowInfoQuery({
    variables: { followingId: currentUser.sub, followerId: userId },
  });
  const [insertFollow] = useInsertFollowMutation({
    variables: { followingId: currentUser.sub, followerId: userId },
    refetchQueries: [
      { query: GetFollowInfoDocument, variables: { followingId: currentUser.sub, followerId: userId } },
      { query: GetFollowInfoDocument, variables: { followingId: userId, followerId: currentUser.sub } },
    ],
  });
  const [deleteFollow] = useDeleteFollowMutation({
    variables: { followingId: currentUser.sub, followerId: userId },
    refetchQueries: [
      { query: GetFollowInfoDocument, variables: { followingId: currentUser.sub, followerId: userId } },
      { query: GetFollowInfoDocument, variables: { followingId: userId, followerId: currentUser.sub } },
    ],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const viewingSelf = useMemo(() => currentUser.sub === userId, [currentUser, userId]);
  const handleClickBackToHome = useCallback(() => history.push(paths.home), [history]);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleClickLogout = useCallback(() => logout({ returnTo: window.location.origin }), [logout]);
  const handleInsertFollow = useCallback(() => insertFollow(), [insertFollow]);
  const handleDeleteFollow = useCallback(() => deleteFollow(), [deleteFollow]);

  return getUsersInfoLoading || getFollowInfoLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Header>
        <BackButtonWrapper>
          <IconButton size="small" onClick={handleClickBackToHome}>
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
      <Content>
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
                  <CellValue>{getFollowInfoData?.followersCount?.aggregate?.count ?? 0}</CellValue>
                  <CellLabel>フォロワー</CellLabel>
                </Cell>
                <Cell>
                  <CellValue>{getFollowInfoData?.followingCount?.aggregate?.count ?? 0}</CellValue>
                  <CellLabel>フォロー中</CellLabel>
                </Cell>
              </Summary>
            </UsersInfo>
            {viewingSelf ? (
              <EditProfileButton variant="outlined">プロフィールを編集</EditProfileButton>
            ) : getFollowInfoData?.follow.length ? (
              <FollowButton variant="outlined" onClick={handleDeleteFollow}>
                フォローをやめる
              </FollowButton>
            ) : (
              <FollowButton variant="contained" color="secondary" onClick={handleInsertFollow}>
                フォローする
              </FollowButton>
            )}
          </UsersProfile>
          <UsersPosts>
            {getUsersInfoData?.users[0].posts.map(({ id, image }) => <PostImage key={id} src={image} />) || null}
          </UsersPosts>
        </div>
      </Content>
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
