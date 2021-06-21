import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import Container from '@material-ui/core/Container';
import ScreenShare from './ScreenShare';
import ScreenTime from './ScreenTime';
import './options.scss';

const Options = () => {
  const [activeTab, setActiveTab] = useState('st');
  return (
    <div>
      <CssBaseline />
      <Drawer className="drawer" variant="permanent" anchor="left">
        <div className="logo">
          <h1>LongMile</h1>
        </div>
        <List className="list">
          <ListItem
            button
            className={`${activeTab === 'st' && 'active'} list-item`}
            selected={activeTab === 'st'}
            onClick={() => {
              if (activeTab !== 'st') setActiveTab('st');
            }}
          >
            <ListItemIcon className="icon">
              <PersonalVideoIcon />
            </ListItemIcon>
            <ListItemText primary="Screen Time" />
          </ListItem>
          <ListItem
            className={`${activeTab === 'sg' && 'active'} list-item`}
            button
            selected={activeTab === 'sg'}
            onClick={() => {
              if (activeTab !== 'sg') setActiveTab('sg');
            }}
          >
            <ListItemIcon className="icon">
              <SecurityRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="ScreenShare Guard" />
          </ListItem>
        </List>
      </Drawer>
      <Container className="container">
        {activeTab === 'st' ? <ScreenTime /> : <ScreenShare />}
      </Container>
    </div>
  );
};

export default Options;
