/* eslint-disable react/function-component-definition */
import About from './partials/About';
import DepoStake from './partials/DepoStake';
import EarnWithDepo from './partials/EarnWithDepo';
import LPTokenStaking from './partials/LPTokenStaking';
import TradingRewards from './partials/TradingRewards';
import { Container } from '@mui/material';
import React from 'react';

const Rewards: React.FC = () => (
  <Container>
    <About />
    <DepoStake />
    <TradingRewards />
    <LPTokenStaking />
    <EarnWithDepo />
  </Container>
);

export default Rewards;
