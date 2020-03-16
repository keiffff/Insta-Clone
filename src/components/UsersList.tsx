import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

type Props = {
  users: Omit<User, 'onClick'>[];
  onClick: User['onClick'];
};

type User = {
  id: string;
  name: string;
  avatar: string;
  onClick: (id: string) => void;
};

const Body = styled.div`
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid #dbdbdb;
  background: #ffffff;
`;

const Header = styled.header`
  padding: 8px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  width: 100%;
  display: flex;
  & + & {
    margin-top: 8px;
  }
`;

const AvatarCell = styled.div`
  width: 15%;
  padding: 8px;
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

const InfoCell = styled.div`
  width: 50%;
  padding: 8px;
  font-weight: bold;
  font-size: 12px;
`;

const FollowCell = styled.div`
  width: 35%;
  margin: auto;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
`;

const FollowButton = styled(Button)`
  .MuiButton-label {
    font-weight: bold;
  }
`;

const Item = ({ id, name, avatar, onClick }: User) => {
  const handleClick = useCallback(() => onClick(id), [onClick, id]);

  return (
    <Row>
      <AvatarCell>
        <AvatarWrapper>
          <Avatar src={avatar} />
        </AvatarWrapper>
      </AvatarCell>
      <InfoCell>{name}</InfoCell>
      <FollowCell>
        <FollowButton variant="contained" color="secondary" size="small" onClick={handleClick}>
          フォローする
        </FollowButton>
      </FollowCell>
    </Row>
  );
};

export const UsersList = ({ users, onClick }: Props) => (
  <Body>
    <Header>
      <Title>おすすめ</Title>
    </Header>
    <List>
      {users.map(({ id, name, avatar }) => (
        <Item key={id} id={id} name={name} avatar={avatar} onClick={onClick} />
      ))}
    </List>
  </Body>
);
