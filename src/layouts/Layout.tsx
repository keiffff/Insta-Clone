import React, { useCallback, useState, ComponentProps, ReactNode } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { GetNewPostsDocument, useGetUsersAvatarQuery, useInsertPostMutation } from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { useAuth0 } from '../providers/Auth0';
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
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const { user } = useAuth0();
  const { data: getUsersAvatarData } = useGetUsersAvatarQuery({ variables: { id: user.sub } });
  const handleSubmitNewPost = useCallback(
    async (caption: string) => {
      const { data } = await uploadFile({ variables: { file } });
      if (!data?.uploadFile) return;
      insertPost({
        variables: { image: data.uploadFile, caption, userId: user.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: user.sub } }],
      });
      setPreviewUrl('');
      setNewPostScreenVisible(false);
      history.push(paths.home);
    },
    [insertPost, file, uploadFile, user, history],
  );
  const handleCloseNewPostScreen = useCallback(() => {
    setPreviewUrl('');
    setNewPostScreenVisible(false);
  }, []);
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
        onUploadFile={handleUploadFile}
      />
      {newPostScreenVisible ? (
        <NewPostScreen imageUrl={previewUrl} onSubmit={handleSubmitNewPost} onClose={handleCloseNewPostScreen} />
      ) : null}
    </main>
  );
};
