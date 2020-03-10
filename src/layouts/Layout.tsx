import React, { useCallback, ComponentProps, ReactNode } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { useNewPost } from '../providers/NewPost';
import { PageFooter } from '../components/PageFooter';
import { NewPostScreen } from '../components/NewPostScreen';
import { paths } from '../constants/paths';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const history = useHistory();
  const location = useLocation();
  const { previewUrl, loadFile, resetUploadItem, submitPost } = useNewPost();
  const { user: currentUser } = useAuth0();
  const handleSubmitNewPost = useCallback(
    (caption: string) => {
      resetUploadItem();
      history.push(paths.home);
      submitPost(caption);
    },
    [submitPost, resetUploadItem, history],
  );
  const handleClickPageFooterNavigation = useCallback<ComponentProps<typeof PageFooter>['onClickNavigation']>(
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
      {children}
      <PageFooter
        user={{ id: currentUser.sub, avatar: currentUser.picture }}
        currentPath={location.pathname}
        onClickNavigation={handleClickPageFooterNavigation}
        onUploadFile={loadFile}
      />
      {previewUrl ? (
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={resetUploadItem} />
      ) : null}
    </>
  );
};
