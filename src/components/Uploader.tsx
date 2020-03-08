import React, { useCallback, forwardRef, ChangeEventHandler, ReactNode, Ref } from 'react';
import styled from 'styled-components';

type Props = {
  capture?: 'user' | 'environment' | boolean;
  children: ReactNode;
  onUpload: (file: File) => void;
};

const FileInput = styled.input`
  display: none;
`;

export const Uploader = forwardRef(({ capture = false, children, onUpload }: Props, ref: Ref<HTMLInputElement>) => {
  const handleUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const { files } = e.target;
      if (!files?.length) return;
      onUpload(files[0]);
    },
    [onUpload],
  );

  return (
    <>
      <FileInput ref={ref} type="file" accept="image/*" onChange={handleUpload} capture={capture} />
      <label htmlFor="upload-button">{children}</label>
    </>
  );
});
