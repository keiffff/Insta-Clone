import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const CircularProgressWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  left: 0px;
`;

export const LoadingScreen = () => (
  <CircularProgressWrapper>
    <CircularProgress size={50} />
  </CircularProgressWrapper>
);
