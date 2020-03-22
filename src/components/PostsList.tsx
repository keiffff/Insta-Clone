import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  Avatar,
  Button,
  Card as CardOrigin,
  CardActions,
  CardHeader as CardHeaderOrigin,
  CardContent as CardContentOrigin,
  CardMedia as CardMediaOrigin,
  IconButton,
} from '@material-ui/core';
import { ChatBubbleOutline, FavoriteBorder, FavoriteOutlined, MoreHoriz } from '@material-ui/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { paths } from '../constants/paths';

type Likes = { id: number }[];

type Comments = { id: number; comment: string; user: { name: string } }[];

type Props = {
  posts: (Omit<Post, 'liked' | 'createdAt' | 'onClick'> & { likes: Likes; created_at: string })[];
  onClick: Post['onClick'];
};

type Post = {
  id: number;
  image: string;
  caption: string;
  liked?: boolean;
  user: {
    id: string;
    avatar: string;
    name: string;
  };
  createdAt: string;
  comments: Comments;
  onClick: (action: 'openMenu' | 'like' | 'unlike', postId: number) => void;
};

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

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

const CardContent = styled(CardContentOrigin)`
  &.MuiCardContent-root:last-child {
    padding: 8px;
  }
`;

const CaptionRow = styled.div`
  width: 100%;
  display: flex;
`;

const CaptionBase = styled.p`
  display: inline-block;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.8;
`;

const Caption = styled(CaptionBase)`
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const CaptionExpanded = styled(CaptionBase)`
  width: 100%;
  word-wrap: break-word;
`;

const ReadMoreCell = styled.div`
  width: 30%;
  display: inline-block;
`;

const ReadMoreButton = styled(Button)`
  .MuiButton-label {
    color: #999999;
  }
`;

const TimeStampLabel = styled.time`
  font-size: 12px;
  color: #999999;
`;

const CommentsRow = styled.div`
  width: 100%;
`;

const Comment = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.8;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const CommentsLink = styled(Link)`
  text-decoration: none;
  font-size: 14px;
  color: #999999;
`;

const Item = ({ id, image, caption, liked = false, user, createdAt, comments, onClick }: Post) => {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [like, setLike] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleClickLeader = useCallback(() => onClick('openMenu', id), [onClick, id]);
  const handleClickLike = useCallback(() => {
    setLike(v => !v);
    onClick(liked ? 'unlike' : 'like', id);
  }, [onClick, liked, id]);
  const handleClickReadMore = useCallback(() => setExpanded(true), []);
  const timestampLabel = useMemo(() => format(new Date(createdAt), 'yyyy年M月d日'), [createdAt]);
  useEffect(() => {
    setLike(liked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ellipsisApplied = captionRef.current ? captionRef.current.offsetWidth < captionRef.current.scrollWidth : false;

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
        </FeedbackActions>
      </CardActions>
      <CardContent>
        <CaptionRow>
          {expanded ? (
            <CaptionExpanded>{caption}</CaptionExpanded>
          ) : (
            <Caption ref={captionRef}>{`${user.name} ${caption}`}</Caption>
          )}
          {ellipsisApplied && !expanded ? (
            <ReadMoreCell>
              <ReadMoreButton size="small" onClick={handleClickReadMore}>
                続きを読む
              </ReadMoreButton>
            </ReadMoreCell>
          ) : null}
        </CaptionRow>
        <CommentsRow>
          {comments.length > 0 ? <Comment>{`${comments[0].user.name} ${comments[0].comment}`}</Comment> : null}
          {comments.length > 1 ? (
            <CommentsLink to="#">{`コメント${comments.length}件すべてを表示`}</CommentsLink>
          ) : null}
        </CommentsRow>
        <TimeStampLabel>{timestampLabel}</TimeStampLabel>
      </CardContent>
    </Card>
  );
};

export const PostsList = ({ posts, onClick }: Props) => (
  <List>
    {posts.map(({ id, caption, image, user, likes, comments, created_at: createdAt }) => (
      <li key={id}>
        <Item
          id={id}
          image={image}
          caption={caption}
          user={user}
          liked={likes.length > 0}
          createdAt={createdAt}
          comments={comments}
          onClick={onClick}
        />
      </li>
    ))}
  </List>
);
