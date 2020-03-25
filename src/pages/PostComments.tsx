import React, { useMemo, ComponentProps } from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, IconButton, Slide } from '@material-ui/core';
import { ChevronLeft, Telegram } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '../providers/Auth0';
import { CommentsList } from '../components/CommentsList';
import { useGetCommentsQuery, useGetUsersInfoQuery } from '../types/hasura';

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
  background: #ffffff;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  z-index: 1000;
  padding: 8px 0px;
  border-bottom: 1px solid #dbdbdb;
`;

const BackButtonWrapper = styled.div`
  margin-left: 12px;
`;

const Title = styled.h1`
  font-size: 14px;
  margin: 0;
`;

const ShareButtonWrapper = styled.div`
  margin-right: 12px;
`;

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
`;

const Content = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 8px;
`;

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: block;
  z-index: 1000;
  padding: 8px 0px 16px;
`;

const EmojiButtonsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const EmojiButton = styled(IconButton)`
  &.MuiIconButton-root {
    color: unset;
    font-size: 28px;
  }
`;

const AddCommentRow = styled.div`
  width: 100%;
  display: flex;
`;

const AvatarCell = styled.div`
  width: 10%;
  padding: 8px;
  flex-shrink: 0;
`;

const AvatarWrapper = styled.div`
  width: 100%;
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

const TextFieldCell = styled.div`
  width: 90%;
  padding: 8px 8px 8px 0px;
`;

const TextFieldWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  border: 1px solid #dbdbdb;
  border-radius: 999rem;
  padding: 0px 8px;
`;

const TextField = styled.input`
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  border: none;
  outline: 0;
  height: 14px;
`;

const SubmitButton = styled(Button)`
  .MuiButton-label {
    color: #3797f7;
    font-weight: bold;
  }
`;

const emojiItems = [
  { label: 'clapping-hands', value: '👏' },
  { label: 'thumbs-up', value: '👍' },
  { label: 'red-heart', value: '❤️' },
  { label: 'raising-hands', value: '🙌' },
  { label: 'fire', value: '🔥' },
  { label: 'crying', value: '😢' },
  { label: 'smiling-face-with-heart-eyes', value: '😍' },
  { label: 'face-with-open-mouth', value: '😮' },
];

export const PostComments = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth0();
  const { loading: getCommentsLoading, data: getCommentsData } = useGetCommentsQuery({
    variables: { postId: Number(postId) },
  });
  const { loading: getUsersInfoLoading, data: getUsersInfoData } = useGetUsersInfoQuery({
    variables: { id: currentUser.sub },
  });
  const commentsWithPost = useMemo<ComponentProps<typeof CommentsList>['comments']>(() => {
    if (!getCommentsData) return [];
    const { posts_by_pk: post, comments } = getCommentsData;

    return [
      { user: post?.user ?? { avatar: '', name: '' }, comment: post?.caption ?? '' },
      ...comments.map(({ user, comment }) => ({ user, comment })),
    ];
  }, [getCommentsData]);

  return (
    <Slide mountOnEnter unmountOnExit in direction="right">
      <Screen>
        <Header>
          <BackButtonWrapper>
            <IconButton size="small">
              <ChevronLeft />
            </IconButton>
          </BackButtonWrapper>
          <Title>コメント</Title>
          <ShareButtonWrapper>
            <IconButton size="small">
              <Telegram />
            </IconButton>
          </ShareButtonWrapper>
        </Header>
        <Content>
          {getCommentsLoading || getUsersInfoLoading ? (
            <CircularProgressWrapper>
              <CircularProgress size={30} />
            </CircularProgressWrapper>
          ) : (
            <CommentsList comments={commentsWithPost} />
          )}
        </Content>
        <Footer>
          <EmojiButtonsRow>
            {emojiItems.map(({ label, value }) => (
              <EmojiButton key={label} size="small">
                <span role="img" aria-label={label}>
                  {value}
                </span>
              </EmojiButton>
            ))}
          </EmojiButtonsRow>
          <AddCommentRow>
            <AvatarCell>
              <AvatarWrapper>
                <Avatar src={getUsersInfoData?.users_by_pk?.avatar} />
              </AvatarWrapper>
            </AvatarCell>
            <TextFieldCell>
              <TextFieldWrapper>
                <TextField placeholder={`${currentUser.name}としてコメントを追加...`} />
                <SubmitButton size="small">投稿する</SubmitButton>
              </TextFieldWrapper>
            </TextFieldCell>
          </AddCommentRow>
        </Footer>
      </Screen>
    </Slide>
  );
};
