import React, { useCallback, useState, ComponentProps } from 'react';
import styled from 'styled-components';
import { IconButton, List, ListItem, SwipeableDrawer } from '@material-ui/core';
import { ChevronLeft, Menu } from '@material-ui/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { PageFooter } from '../components/PageFooter';
import { NewPostScreen } from '../components/NewPostScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { GetNewPostsDocument, useInsertPostMutation } from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { useAuth0 } from '../providers/Auth0';
import { paths } from '../constants/paths';

const Page = styled.div`
  padding: 48px 0px 80px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Header = styled.header`
  background: #ffffff;
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
  const { user: currentUser, logout } = useAuth0();
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [newPostScreenVisible, setNewPostScreenVisible] = useState(false);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleClickLogout = useCallback(() => logout({ returnTo: window.location.origin }), [logout]);
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

  return uploadFileLoading || insertPostLoading ? (
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
          <UserNameLabel>{currentUser.name}</UserNameLabel>
          <MenuButtonWrapper>
            <IconButton size="small" onClick={handleOpenDrawer}>
              <Menu />
            </IconButton>
          </MenuButtonWrapper>
        </Header>
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
