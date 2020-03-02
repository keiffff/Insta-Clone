import * as React from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardHeader as CardHeaderOrigin,
  CardContent as CardContentOrigin,
  CardMedia as CardMediaOrigin,
  IconButton,
} from '@material-ui/core';
import { ChatBubbleOutline, FavoriteBorder, MoreHoriz, Telegram, TurnedInNot } from '@material-ui/icons';
import styled from 'styled-components';

type Props = {
  image: string;
  caption: string;
  user: {
    avatar: string;
    name: string;
  };
};

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

export const PostItem = ({ image, caption, user }: Props) => (
  <Card>
    <CardHeader
      avatar={<Avatar src={user.avatar} />}
      action={
        <IconButton size="small">
          <MoreHoriz />
        </IconButton>
      }
      title={user.name}
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
);
