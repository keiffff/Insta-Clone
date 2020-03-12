import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useGetUsersEditableInfoQuery } from '../types/hasura';
import { useUploadFileMutation } from '../types/fileUpload';
import { Uploader } from '../components/Uploader';
import { paths } from '../constants/paths';

const Screen = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1300;
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
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  padding: 4px;
`;

const CancelButton = styled(Button)`
  .MuiButton-label {
    font-weight: bold;
  }
`;

const Title = styled.h1`
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
`;

const SubmitButton = styled(Button)`
  .MuiButton-label {
    color: #3797f7;
    font-weight: bold;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  background: #ffffff;
  display: block;
`;

const EditAvatar = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid #dbdbdb;
`;

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 104px;
  height: 104px;
  border-radius: 50%;
`;

const EditAvatarButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const EditAvatarButton = styled(Button)`
  .MuiButton-label {
    color: #3797f7;
    font-weight: bold;
  }
`;

const EditForm = styled.form`
  width: 100%;
  padding: 8px 0px 8px;
`;

const EditList = styled.dl`
  width: 90%;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: bold;
  dt {
    width: 30%;
    display: inline-block;
  }
  dd {
    width: 70%;
    display: inline-block;
    margin: 0px 0px 8px 0px;
    padding-bottom: 8px;
    border-bottom: 1px solid #dbdbdb;
  }
`;

const TextField = styled.input`
  display: inline-flex;
  font-size: 16px;
  font-weight: bold;
  outline: 0;
`;

export const ProfileEdit = () => {
  const history = useHistory();
  const { id: userId } = useParams<{ id: string }>();
  const { data: getUsersEditableInfoData } = useGetUsersEditableInfoQuery({ variables: { id: userId } });
  const [uploadFile] = useUploadFileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const handleClickCancelButton = useCallback(() => history.replace(`${paths.profile}/${userId}`), [history, userId]);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleUploadFile = useCallback(
    (fileArg: File) => {
      setFile(fileArg);
      const reader = new FileReader();
      reader.readAsDataURL(fileArg);
      reader.onload = () => setAvatar(reader.result as string);
      uploadFile({ variables: { file } });
    },
    [uploadFile, file],
  );
  useEffect(() => {
    if (!getUsersEditableInfoData) return;
    const userInfo = getUsersEditableInfoData.users[0];
    setAvatar(userInfo.avatar);
    setName(userInfo.name);
    setDescription(userInfo.description ?? '');
  }, [getUsersEditableInfoData]);

  return (
    <Screen>
      <Header>
        <CancelButton onClick={handleClickCancelButton}>キャンセル</CancelButton>
        <Title>プロフィールを編集</Title>
        <SubmitButton>完了</SubmitButton>
      </Header>
      <UserInfo>
        <EditAvatar>
          <AvatarWrapper>
            <IconButton onClick={handleClickUploadButton}>
              <Avatar src={avatar} />
            </IconButton>
          </AvatarWrapper>
          <EditAvatarButtonWrapper>
            <Uploader ref={fileInputRef} onUpload={handleUploadFile}>
              <EditAvatarButton onClick={handleClickUploadButton}>プロフィール写真を変更</EditAvatarButton>
            </Uploader>
          </EditAvatarButtonWrapper>
        </EditAvatar>
        <EditForm>
          <EditList>
            <dt>名前</dt>
            <dd>
              <TextField type="text" value={name} onChange={() => {}} />
            </dd>
            <dt>自己紹介</dt>
            <dd>
              <TextField type="text" placeholder="自己紹介" value={description} onChange={() => {}} />
            </dd>
          </EditList>
        </EditForm>
      </UserInfo>
    </Screen>
  );
};
