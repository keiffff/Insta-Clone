import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { ExecutionResult } from '@apollo/react-common';
import { useUploadFileMutation, UploadFileMutation } from '../types/fileUpload';

type Props = {
  children: ReactNode;
};

type FileUploadContext = {
  loading: boolean;
  previewUrl: string;
  loadFile: (file: File) => void;
  submitFile: () => Promise<ExecutionResult<UploadFileMutation>>;
  resetUploadItem: () => void;
};

const FileUploadContext = createContext<FileUploadContext>({
  loading: false,
  previewUrl: '',
  loadFile: () => {},
  submitFile: ((() => {}) as unknown) as () => Promise<ExecutionResult<UploadFileMutation>>,
  resetUploadItem: () => {},
});

export function useFileUpload() {
  return useContext(FileUploadContext);
}

export const FileUploadProvider = ({ children }: Props) => {
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');
  const loadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setPreviewUrl(reader.result as string);
  }, []);
  const submitFile = useCallback(() => uploadFile({ variables: { file } }), [uploadFile, file]);
  const resetUploadItem = useCallback(() => setPreviewUrl(''), []);

  return (
    <FileUploadContext.Provider
      value={{
        loading: uploadFileLoading,
        previewUrl,
        loadFile,
        submitFile,
        resetUploadItem,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
