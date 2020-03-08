import React, { useCallback, useState, ChangeEventHandler } from 'react';
import { CircularProgress, Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import styled from 'styled-components';

type Props = {
  imageUrl?: string;
  loading: boolean;
  onSubmit: (imageUrl: string, caption: string) => void;
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

const Header = styled.header`
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

const Title = styled.h1`
  font-size: 14px;
  margin: 0 auto;
  line-height: 1.4;
`;

const SubmitButton = styled(Button)`
  .MuiButton-label {
    color: #3797f7;
  }
`;

const CONTAINER_HEIGHT = 144;

const Container = styled.div`
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

const Caption = styled.textarea`
  width: calc(100% - ${CONTAINER_HEIGHT}px);
  height: ${CONTAINER_HEIGHT}px;
  padding: 0;
  margin-left: 8px;
  outline: none;
  font-size: 14px;
  resize: none;
`;

export const NewPostScreen = ({ imageUrl, loading, onSubmit, onClose }: Props) => {
  const [caption, setCaption] = useState('');
  const handleChangeCaption = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => setCaption(e.currentTarget.value),
    [],
  );
  const handleClickSubmit = useCallback(() => {
    if (!imageUrl || !caption) return;
    onSubmit(imageUrl, caption);
  }, [imageUrl, caption, onSubmit]);

  return (
    <Screen>
      <Header>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
        <Title>新しい写真投稿</Title>
        <SubmitButton size="small" onClick={handleClickSubmit}>
          シェア
        </SubmitButton>
      </Header>
      {loading ? (
        <CircularProgressWrapper>
          <CircularProgress size={30} />
        </CircularProgressWrapper>
      ) : imageUrl ? (
        <Container>
          <UploadedImage src={imageUrl} alt="uploaded-image" />
          <Caption placeholder="キャプションを書く" onChange={handleChangeCaption} />
        </Container>
      ) : null}
    </Screen>
  );
};