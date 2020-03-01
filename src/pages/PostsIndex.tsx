import * as React from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardHeader as CardHeaderOrigin,
  CardContent as CardContentOrigin,
  CardMedia as CardMediaOrigin,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import {
  AddBoxOutlined,
  ChatBubbleOutline,
  FavoriteBorder,
  MoreHoriz,
  Telegram,
  TurnedInNot,
} from '@material-ui/icons';
import styled from 'styled-components';
import { useNotifyNewPostsSubscription } from '../types/graphql';
import logo from '../assets/images/logo.png';

const Page = styled.div`
  padding-top: 45px;
`;

const Header = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 12px;
`;

const Logo = styled.img`
  width: 100px;
  margin: auto;
`;

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const CardHeader = styled(CardHeaderOrigin)`
  &.MuiCardHeader-root {
    padding: 8px;
  }
  .MuiCardHeader-action {
    margin: auto;
  }
`;

const CardMedia = styled(CardMediaOrigin)`
  width: 100%;
  padding: 144px 0px;
`;

const FeedbackActions = styled.div`
  display: flex;
`;

const SaveAsCollectionButtonWrapper = styled.div`
  margin-left: auto;
`;

const CardContent = styled(CardContentOrigin)`
  &.MuiCardContent-root:last-child {
    padding: 8px;
  }
`;

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 8px;
`;

const AddButtonWrapper = styled.div`
  margin: auto;
`;

export const PostsIndex = () => {
  const { loading, data } = useNotifyNewPostsSubscription();

  return (
    <Page>
      <Header>
        <Logo src={logo} alt="logo" />
      </Header>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {data?.Post.map(({ uuid, caption, image, User }) => (
            <li key={uuid}>
              <Card>
                <CardHeader
                  avatar={<Avatar src={User.avatar} />}
                  action={
                    <IconButton size="small">
                      <MoreHoriz />
                    </IconButton>
                  }
                  title={User.name}
                />
                <CardMedia image={image} />
                <CardActions disableSpacing>
                  <FeedbackActions>
                    <IconButton size="small">
                      <FavoriteBorder />
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
            </li>
          )) || null}
        </List>
      )}
      <Footer>
        <AddButtonWrapper>
          <IconButton size="small">
            <AddBoxOutlined />
          </IconButton>
        </AddButtonWrapper>
      </Footer>
    </Page>
  );
};
