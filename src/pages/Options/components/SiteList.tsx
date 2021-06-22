import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

import { SiteBlur } from '../utils';

interface Props {
  sites: SiteBlur[];
  onDelete: (host: string) => void;
  onToggle: (host: string) => void;
}

const SiteList: React.FC<Props> = ({ sites, onDelete, onToggle }) => {
  return (
    <List>
      {sites.map((site) => {
        return (
          <>
            <ListItem>
              <ListItemText primary={site.host} />
              <ListItemIcon>
                <Switch
                  edge="start"
                  onChange={() => onToggle(site.host)}
                  checked={site.enabled}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-bluetooth',
                  }}
                />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => onDelete(site.host)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </>
        );
      })}
    </List>
  );
};

export default SiteList;
