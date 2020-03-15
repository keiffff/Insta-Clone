import React, { useCallback, useState, useEffect } from 'react';
import {
  Avatar,
  Card as CardOrigin,
  CardActions,
  CardHeader as CardHeaderOrigin,
  CardContent as CardContentOrigin,
  CardMedia as CardMediaOrigin,
  IconButton,
} from '@material-ui/core';
import {
  ChatBubbleOutline,
  FavoriteBorder,
  FavoriteOutlined,
  MoreHoriz,
  Telegram,
  TurnedInNot,
} from '@material-ui/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { paths } from '../constants/paths';

type Props = {
  id: number;
  image: string;
  caption: string;
  liked?: boolean;
  user: {
    id: string;
    avatar: string;
    name: string;
  };
  onClick: (action: 'openMenu' | 'like' | 'unlike', postId: number) => void;
};

const Card = styled(CardOrigin)`
  &.MuiCard-root {
    box-shadow: none;
    border-radius: unset;
  }
`;

const CardHeader = styled(CardHeaderOrigin)`
  &.MuiCardHeader-root {
    padding: 8px;
  }
  .MuiCardHeader-action {
    margin: auto;
  }
`;

const CardHeaderInnerLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  color: #262626;
`;

const CardMediaWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const CardMedia = styled(CardMediaOrigin)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FeedbackActions = styled.div`
  display: flex;
`;

const LikeIcon = styled(FavoriteOutlined)`
  color: #db183d;
`;

const SaveAsCollectionButtonWrapper = styled.div`
  margin-left: auto;
`;

const CardContent = styled(CardContentOrigin)`
  &.MuiCardContent-root:last-child {
    padding: 8px;
  }
`;

export const PostItem = ({ id, image, caption, liked = false, user, onClick }: Props) => {
  const [like, setLike] = useState(false);
  const handleClickLeader = useCallback(() => onClick('openMenu', id), [onClick, id]);
  const handleClickLike = useCallback(() => {
    setLike(v => !v);
    onClick(liked ? 'unlike' : 'like', id);
  }, [onClick, liked, id]);
  useEffect(() => {
    setLike(liked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={user.avatar} />}
        action={
          <IconButton size="small" onClick={handleClickLeader}>
            <MoreHoriz />
          </IconButton>
        }
        title={<CardHeaderInnerLink to={`${paths.profile}/${user.id}`}>{user.name}</CardHeaderInnerLink>}
      />
      <CardMediaWrapper>
        <CardMedia image={image} />
      </CardMediaWrapper>
      <CardActions disableSpacing>
        <FeedbackActions>
          <IconButton size="small" onClick={handleClickLike}>
            {like ? <LikeIcon /> : <FavoriteBorder />}
          </IconButton>
          <IconButton size="small">
            <ChatBubbleOutline />
          </IconButton>
          <IconButton size="small">
            <Telegram />
          </IconButton>
        </FeedbackActions>
        <SaveAsCollectionButtonWrapper>
          <IconButton size="small">
            <TurnedInNot />
          </IconButton>
        </SaveAsCollectionButtonWrapper>
      </CardActions>
      <CardContent>{caption}</CardContent>
    </Card>
  );
};
