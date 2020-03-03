import React from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import styled from 'styled-components';

type Props = {
  imageUrl?: string;
  loading: boolean;
  onClose: () => void;
};

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1200;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 45px;
  display: flex;
  justify-content: center;
  background: #fafafa;
`;

const NewPostScreenHeader = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
  padding: 7px;
`;

const NewPostScreenHeaderTitle = styled.h1`
  font-size: 14px;
  margin: 0 auto;
  line-height: 1.4;
`;

const CONTAINER_HEIGHT = 144;

const NewPostContainer = styled.div`
  width: 100%;
  height: ${CONTAINER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding: 8px;
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
`;

const UploadedImage = styled.img`
  width: ${CONTAINER_HEIGHT}px;
  height: ${CONTAINER_HEIGHT}px;
`;

const NewPostCaption = styled.textarea`
  width: calc(100% - ${CONTAINER_HEIGHT}px);
  height: ${CONTAINER_HEIGHT}px;
  padding: 0;
  margin-left: 8px;
  outline: none;
  font-size: 14px;
  resize: none;
`;

export const NewPostScreen = ({ imageUrl, loading, onClose }: Props) => (
  <Screen>
    <NewPostScreenHeader>
      <IconButton size="small" onClick={onClose}>
        <Close />
      </IconButton>
      <NewPostScreenHeaderTitle>新しい写真投稿</NewPostScreenHeaderTitle>
    </NewPostScreenHeader>
    {loading ? (
      <CircularProgressWrapper>
        <CircularProgress size={30} />
      </CircularProgressWrapper>
    ) : imageUrl ? (
      <NewPostContainer>
        <UploadedImage src={imageUrl} alt="uploaded-image" />
        <NewPostCaption placeholder="キャプションを書く" />
      </NewPostContainer>
    ) : null}
  </Screen>
);
