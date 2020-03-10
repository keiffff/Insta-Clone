import React, { useCallback, useRef } from 'react';
import { IconButton } from '@material-ui/core';
import { AddBoxOutlined, Home, HomeOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { Uploader } from './Uploader';
import { paths } from '../constants/paths';

type Props = {
  user: {
    id: string;
    avatar: string;
  };
  currentPath: string;
  onClickNavigation: (action: 'home' | 'profile') => void;
  onUploadFile: (file: File) => void;
};

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 8px 0px;
`;

const HomeButtonWrapper = styled.div`
  margin-left: 12px;
  display: flex;
`;

const AddButtonWrapper = styled.div`
  margin: auto;
`;

const UserButtonWrapper = styled.div`
  margin-right: 12px;
`;

const UserIcon = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid transparent;
`;

const UserIconSelected = styled(UserIcon)`
  border: 1px solid #262626;
`;

export const PageFooter = ({ user, currentPath, onClickNavigation, onUploadFile }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickHomeButton = useCallback(() => onClickNavigation('home'), [onClickNavigation]);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleClickUserButton = useCallback(() => onClickNavigation('profile'), [onClickNavigation]);

  return (
    <Footer>
      <HomeButtonWrapper>
        <IconButton size="small" onClick={handleClickHomeButton}>
          {currentPath === paths.home ? <Home /> : <HomeOutlined />}
        </IconButton>
      </HomeButtonWrapper>
      <AddButtonWrapper>
        <Uploader ref={fileInputRef} onUpload={onUploadFile}>
          <IconButton size="small" onClick={handleClickUploadButton}>
            <AddBoxOutlined />
          </IconButton>
        </Uploader>
      </AddButtonWrapper>
      <UserButtonWrapper>
        <IconButton size="small" onClick={handleClickUserButton}>
          {currentPath.startsWith(paths.profile) ? (
            <UserIconSelected src={user.avatar} />
          ) : (
            <UserIcon src={user.avatar} />
          )}
        </IconButton>
      </UserButtonWrapper>
    </Footer>
  );
};
