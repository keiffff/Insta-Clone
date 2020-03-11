import React, { useCallback, ComponentProps, ReactNode } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { GetNewPostsDocument, useGetUsersAvatarQuery, useInsertPostMutation } from '../types/hasura';
import { useAuth0 } from '../providers/Auth0';
import { useFileUpload } from '../providers/FileUpload';
import { PageFooter } from '../components/PageFooter';
import { LoadingScreen } from '../components/LoadingScreen';
import { NewPostScreen } from '../components/NewPostScreen';
import { paths } from '../constants/paths';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const history = useHistory();
  const location = useLocation();
  const { loading: uploadFileLoading, previewUrl, loadFile, submitFile, resetUploadItem } = useFileUpload();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const { user } = useAuth0();
  const { data: getUsersAvatarData } = useGetUsersAvatarQuery({ variables: { id: user.sub } });
  const handleSubmitNewPost = useCallback(
    async (caption: string) => {
      const { data } = await submitFile();
      if (!data?.uploadFile) return;
      insertPost({
        variables: { image: data.uploadFile, caption, userId: user.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: user.sub } }],
      });
      resetUploadItem();
      history.push(paths.home);
    },
    [submitFile, insertPost, resetUploadItem, user, history],
  );
  const handleClickPageFooterNavigation = useCallback<ComponentProps<typeof PageFooter>['onClickNavigation']>(
    action => {
      switch (action) {
        case 'home':
          history.push(paths.home);
          break;
        case 'profile':
          history.push(`${paths.profile}/${user.sub}`);
          break;
        default:
          break;
      }
    },
    [history, user],
  );

  return uploadFileLoading || insertPostLoading ? (
    <LoadingScreen />
  ) : (
    <main>
      {children}
      <PageFooter
        avatar={getUsersAvatarData?.users[0].avatar || ''}
        currentPath={location.pathname}
        onClickNavigation={handleClickPageFooterNavigation}
        onUploadFile={loadFile}
      />
      {previewUrl ? (
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={resetUploadItem} />
      ) : null}
    </main>
  );
};
