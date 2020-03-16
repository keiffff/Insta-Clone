import React, { useCallback, useEffect, useState, useRef, ChangeEventHandler } from 'react';
import { Button, CircularProgress, Slide } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useGetUsersEditableInfoQuery, useUpdateUserMutation } from '../types/hasura';
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

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  justify-content: center;
`;

const UserInfo = styled.div`
  width: 100%;
  background: #ffffff;
  display: block;
`;

const EditAvatar = styled.div`
  padding: 8px 0px;
  border-bottom: 1px solid #dbdbdb;
`;

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const AvatarCell = styled.div`
  width: 25%;
  position: relative;
  height: auto;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const Avatar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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
  padding: 16px 0px;
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
  border: none;
  outline: 0;
`;

const initialAttributes = {
  avatar: '',
  name: '',
  description: '',
};

export const ProfileEdit = () => {
  const history = useHistory();
  const { id: userId } = useParams<{ id: string }>();
  const { loading: getUsersEditableInfoLoading, data: getUsersEditableInfoData } = useGetUsersEditableInfoQuery({
    variables: { id: userId },
  });
  const [uploadFile, { loading: uploadFileLoading }] = useUploadFileMutation();
  const [updateUser, { loading: updateUserLoading }] = useUpdateUserMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [attributes, setAttributes] = useState(initialAttributes);
  const handleClickCancelButton = useCallback(() => history.replace(`${paths.profile}/${userId}`), [history, userId]);
  const handleClickUploadButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleUploadFile = useCallback((fileArg: File) => {
    setFile(fileArg);
    const reader = new FileReader();
    reader.readAsDataURL(fileArg);
    reader.onload = () => setAttributes(state => ({ ...state, avatar: reader.result as string }));
  }, []);
  const handleChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    e.persist();
    setAttributes(state => ({ ...state, name: e.target.value }));
  }, []);
  const handleChangeDescription = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    e.persist();
    setAttributes(state => ({ ...state, description: e.target.value }));
  }, []);
  const handleSubmitAttributes = useCallback(async () => {
    let url = '';
    if (file) {
      const { data } = await uploadFile({ variables: { file } });
      url = data?.uploadFile || '';
    }
    await updateUser({ variables: { id: userId, attributes: { ...attributes, ...(url ? { avatar: url } : {}) } } });
    history.replace(`${paths.profile}/${userId}`);
  }, [updateUser, userId, attributes, history, file, uploadFile]);
  useEffect(() => {
    if (!getUsersEditableInfoData) return;
    const { avatar, name, description } = getUsersEditableInfoData.users[0] ?? initialAttributes;
    setAttributes(state => ({ ...state, avatar, name, description: description ?? '' }));
  }, [getUsersEditableInfoData]);

  return (
    <Slide mountOnEnter unmountOnExit in direction="up">
      <Screen>
        <Header>
          <CancelButton onClick={handleClickCancelButton}>キャンセル</CancelButton>
          <Title>プロフィールを編集</Title>
          <SubmitButton onClick={handleSubmitAttributes}>完了</SubmitButton>
        </Header>
        <UserInfo>
          {getUsersEditableInfoLoading || updateUserLoading || uploadFileLoading ? (
            <CircularProgressWrapper>
              <CircularProgress size={30} />
            </CircularProgressWrapper>
          ) : (
            <>
              <EditAvatar>
                <AvatarWrapper>
                  <AvatarCell onClick={handleClickUploadButton}>
                    <Avatar src={attributes.avatar} />
                  </AvatarCell>
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
                    <TextField type="text" value={attributes.name} onChange={handleChangeName} />
                  </dd>
                  <dt>自己紹介</dt>
                  <dd>
                    <TextField
                      type="text"
                      placeholder="自己紹介"
                      value={attributes.description}
                      onChange={handleChangeDescription}
                    />
                  </dd>
                </EditList>
              </EditForm>
            </>
          )}
        </UserInfo>
      </Screen>
    </Slide>
  );
};
