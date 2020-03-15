import React, { MouseEventHandler } from 'react';
import { List as ListOrigin, ListItem as ListItemOrigin } from '@material-ui/core';
import styled from 'styled-components';

type Props = {
  menus: Array<{ label: string; dangerous?: boolean; onClick?: MouseEventHandler }>;
};

const List = styled(ListOrigin)`
  background: #ffffff;
  border-radius: 5px;
`;

const ListItem = styled(ListItemOrigin)`
  &.MuiListItem-root {
    justify-content: center;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
  }
`;

const ListItemDangerous = styled(ListItem)`
  &.MuiListItem-root {
    color: #ed4956;
    font-weight: bold;
  }
`;

export const MenuList = ({ menus }: Props) => {
  return (
    <List>
      {menus.map(({ label, dangerous, onClick }) =>
        dangerous ? (
          <ListItemDangerous key={label} button onClick={onClick}>
            {label}
          </ListItemDangerous>
        ) : (
          <ListItem key={label} button onClick={onClick}>
            {label}
          </ListItem>
        ),
      )}
    </List>
  );
};
