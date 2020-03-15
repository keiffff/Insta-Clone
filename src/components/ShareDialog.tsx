import React, { ComponentProps, useMemo } from 'react';
import {
  Dialog as DialogOrigin,
  DialogTitle as DialogTitleOrigin,
  DialogContent as DialogContentOrigin,
} from '@material-ui/core';
import { Twitter as TwitterOrigin, Facebook as FacebookOrigin } from '@material-ui/icons';
import styled from 'styled-components';

type Sns = 'twitter' | 'facebook';

type Props = {
  sns: Array<Sns>;
  url: string;
} & Pick<ComponentProps<typeof DialogOrigin>, 'open' | 'onClose'>;

const Dialog = styled(DialogOrigin)`
  .MuiPaper-root {
    width: 60%;
  }
`;

const DialogTitle = styled(DialogTitleOrigin)`
  text-align: center;
  .MuiTypography-root {
    font-weight: bold;
  }
  border-bottom: 1px solid #dbdbdb;
`;

const DialogContent = styled(DialogContentOrigin)`
  display: flex;
  justify-content: space-around;
`;

const ShareLink = styled.a`
  text-decoration: none;
`;

const Twitter = styled(TwitterOrigin)`
  color: #1ca1f2;
`;

const Facebook = styled(FacebookOrigin)`
  color: #4167b2;
`;

export const ShareDialog = ({ sns, url, open, onClose }: Props) => {
  const shareUrl = useMemo(
    () => ({
      twitter: `https://twitter.com/share?text=Hasuraで作ったインスタクローンをつかってみましょう！&url=${url}`,
      facebook: `https://www.facebook.com/share.php?u=${url}`,
    }),
    [url],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>シェアする</DialogTitle>
      <DialogContent>
        {sns.includes('twitter') ? (
          <ShareLink target="_blank" rel="noopener noreferrer" href={shareUrl.twitter}>
            <Twitter />
          </ShareLink>
        ) : null}
        {sns.includes('facebook') ? (
          <ShareLink target="_blank" rel="noopener noreferrer" href={shareUrl.facebook}>
            <Facebook />
          </ShareLink>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
