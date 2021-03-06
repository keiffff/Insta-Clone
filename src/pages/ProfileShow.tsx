import React, { useCallback, useState, useMemo, ComponentProps } from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, IconButton, SwipeableDrawer } from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import {
  GetFollowInfoDocument,
  useDeleteFollowMutation,
  useInsertFollowMutation,
  useGetProfileInfoQuery,
  useGetFollowInfoQuery,
} from '../types/hasura';
import { MenuList } from '../components/MenuList';
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

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background: #ffffff;
  z-index: 1000;
  padding: 8px 0px;
`;

const BackButtonWrapper = styled.div`
  margin-left: 12px;
`;

const UserNameLabel = styled.span`
  display: inline-flex;
  margin: auto;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const MenuButtonWrapper = styled.div`
  margin-right: 12px;
`;

const Body = styled.div`
  width: 100%;
`;

const UsersProfile = styled.div`
  padding: 12px;
  border-bottom: 1px solid #dbdbdb;
`;

const AvatarAndSummaryRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 16px;
`;

const AvatarCell = styled.div`
  width: 25%;
  position: relative;
  height: auto;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const Avatar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Summary = styled.div`
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DescriptionRow = styled.div`
  margin-bottom: 16px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
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

const PostImageWrapper = styled.div`
  position: relative;
  width: calc(100% / 3);
  height: auto;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const PostImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DrawerHandle = styled.span`
  display: inline-flex;
  width: 20%;
  padding: 4px;
  margin: 8px auto 0px;
  background: #dbdbdb;
  border-radius: 4px;
`;

export const ProfileShow = () => {
  const history = useHistory();
  const { id: userId } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuth0();
  const { loading: getProfileInfoLoading, data: getProfileInfoData } = useGetProfileInfoQuery({
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
  const handleClickMoveToEdit = useCallback(() => history.push(`/user/${userId}/edit`), [history, userId]);
  const handleInsertFollow = useCallback(() => insertFollow(), [insertFollow]);
  const handleDeleteFollow = useCallback(() => deleteFollow(), [deleteFollow]);
  const menus = useMemo<ComponentProps<typeof MenuList>['menus']>(
    () => [{ label: 'ログアウト', onClick: handleClickLogout }],
    [handleClickLogout],
  );

  return (
    <>
      <Header>
        <BackButtonWrapper>
          <IconButton size="small" onClick={handleClickBackToHome}>
            <ChevronLeft />
          </IconButton>
        </BackButtonWrapper>
        <UserNameLabel>{getProfileInfoData?.users[0].name ?? ''}</UserNameLabel>
        <MenuButtonWrapper>
          <IconButton size="small" onClick={handleOpenDrawer}>
            <Menu />
          </IconButton>
        </MenuButtonWrapper>
      </Header>
      <Content>
        {getProfileInfoLoading || getFollowInfoLoading ? (
          <CircularProgressWrapper>
            <CircularProgress size={30} />
          </CircularProgressWrapper>
        ) : (
          <Body>
            <UsersProfile>
              <AvatarAndSummaryRow>
                <AvatarCell>
                  <Avatar src={getProfileInfoData?.users[0].avatar} />
                </AvatarCell>
                <Summary>
                  <Cell>
                    <CellValue>{getProfileInfoData?.users[0].posts_aggregate.aggregate?.count ?? 0}</CellValue>
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
              </AvatarAndSummaryRow>
              <DescriptionRow>
                <Description>{getProfileInfoData?.users[0].description || ''}</Description>
              </DescriptionRow>
              {viewingSelf ? (
                <EditProfileButton variant="outlined" onClick={handleClickMoveToEdit}>
                  プロフィールを編集
                </EditProfileButton>
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
              {getProfileInfoData?.users[0].posts.map(({ id, image }) => (
                <PostImageWrapper key={id}>
                  <PostImage src={image} />
                </PostImageWrapper>
              )) || null}
            </UsersPosts>
          </Body>
        )}
      </Content>
      <SwipeableDrawer anchor="bottom" open={drawerOpen} onOpen={handleOpenDrawer} onClose={handleCloseDrawer}>
        <DrawerHandle />
        <MenuList menus={menus} />
      </SwipeableDrawer>
    </>
  );
};
