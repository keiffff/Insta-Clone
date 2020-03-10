import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { useAuth0 } from './Auth0';
import { useInsertPostMutation, GetNewPostsDocument } from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';

type Props = {
  children: ReactNode;
};

type NewPostContext = {
  loading: boolean;
  file?: File;
  previewUrl: string;
  loadFile: (file: File) => void;
  resetFile: () => void;
  submitPost: (caption: string) => void;
};

const NewPostContext = createContext<NewPostContext>({
  loading: false,
  file: undefined,
  previewUrl: '',
  loadFile: () => {},
  resetFile: () => {},
  submitPost: () => {},
});

export function useNewPost() {
  return useContext(NewPostContext);
}

export const NewPostProvider = ({ children }: Props) => {
  const { user: currentUser } = useAuth0();
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [insertPost, { loading: insertPostLoading }] = useInsertPostMutation();
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const loadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
  }, []);
  const resetFile = useCallback(() => setFile(undefined), []);
  const submitPost = useCallback(
    async (caption: string) => {
      const { data: uploadFileData } = await uploadFile({ variables: { file } });
      if (!uploadFileData?.uploadFile) return;
      insertPost({
        variables: { image: uploadFileData.uploadFile, caption, userId: currentUser.sub },
        refetchQueries: [{ query: GetNewPostsDocument, variables: { userId: currentUser.sub } }],
      });
    },
    [uploadFile, insertPost, currentUser, file],
  );

  return (
    <NewPostContext.Provider
      value={{ loading: uploadFileLoading || insertPostLoading, previewUrl, file, loadFile, resetFile, submitPost }}
    >
      {children}
    </NewPostContext.Provider>
  );
};
