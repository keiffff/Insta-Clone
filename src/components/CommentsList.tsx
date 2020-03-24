import React from 'react';
import styled from 'styled-components';

type Comment = {
  user: {
    avatar: string;
    name: string;
  };
  comment: string;
};

type Props = {
  comments: Comment[];
};

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  width: 100%;
  display: flex;
  &:first-child {
    border-bottom: 1px solid #dbdbdb;
  }
  & + & {
    margin-top: 8px;
  }
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

const CommentCell = styled.div`
  width: 90%;
  padding: 8px 0px;
  font-size: 14px;
`;

const UserNameLabel = styled.span`
  display: inline-block;
  margin-right: 8px;
  font-weight: bold;
`;

const Comment = styled.p`
  margin: 0;
  padding: 0px 8px 0px 0px;
  word-wrap: break-word;
`;

export const CommentsList = ({ comments }: Props) => {
  return (
    <List>
      {comments.map(({ comment, user }, i) => (
        <Row key={i}>
          <AvatarCell>
            <AvatarWrapper>
              <Avatar src={user.avatar} />
            </AvatarWrapper>
          </AvatarCell>
          <CommentCell>
            <Comment>
              <UserNameLabel>{user.name}</UserNameLabel>
              {comment}
            </Comment>
          </CommentCell>
        </Row>
      ))}
    </List>
  );
};
