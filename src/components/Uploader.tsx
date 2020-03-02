import React, { useCallback, forwardRef, ChangeEventHandler, ReactNode, Ref } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
  onUpload?: (file: File) => void;
};

const FileInput = styled.input`
  display: none;
`;

export const Uploader = forwardRef(({ children, onUpload }: Props, ref: Ref<HTMLInputElement>) => {
  const handleUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const { files } = e.target;
      if (!files?.length || !onUpload) return;
      onUpload(files[0]);
    },
    [onUpload],
  );

  return (
    <>
      <FileInput ref={ref} type="file" accept="image/*" onChange={handleUpload} />
      <label htmlFor="upload-button">{children}</label>
    </>
  );
});
