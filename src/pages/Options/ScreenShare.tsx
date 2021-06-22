import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
  checkHostname,
  getSitesToBlur,
  setSitesToBlur,
  SiteBlur,
} from './utils';
import SiteList from './components/SiteList';

const GreenSwitch = withStyles({
  switchBase: {
    color: '#fff',
    '&$checked': {
      color: '#fff',
    },
    '&$checked + $track': {
      backgroundColor: '#fff',
    },
  },
  checked: {},
  track: {},
})(Switch);

const ScreenShare = () => {
  const [sites, setSites] = useState<Array<SiteBlur>>([]);
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [newSiteError, setNewSiteError] = useState('');
  const fetchSites = async () => {
    const _sites = await getSitesToBlur();
    setSites(_sites.sites);
    setGlobalEnabled(_sites.enabled);
    console.log(globalEnabled, sites);
  };

  const toggleSite = (site: string) => {
    const _sites = sites.map((s) => {
      if (s.host === site) {
        return {
          ...s,
          enabled: !s.enabled,
        };
      }
      return s;
    });
    setSitesToBlur(_sites, globalEnabled);
    setSites(_sites);
  };

  const deleteSite = (site: string) => {
    console.log(site, 'to delte');
    const _sites = sites.filter((s) => s.host !== site);
    setSitesToBlur(_sites, globalEnabled);
    setSites(_sites);
  };

  const addSite = (site: string) => {
    const isValid = checkHostname(newSite);
    if (!isValid) {
      setNewSiteError('Please provide a valid hostname');
      return;
    }
    const alreadyPresent = sites.some(
      (s) => s.host === site || `www.${s.host}` === site
    );
    if (alreadyPresent) {
      setNewSiteError('Already present');
      return;
    }
    const _sites: SiteBlur[] = [{ host: site, enabled: true }, ...sites];
    setSitesToBlur(_sites, globalEnabled);
    setSites(_sites);
  };

  const toggleGlobal = () => {
    setSitesToBlur(sites, !globalEnabled);
    setGlobalEnabled(!globalEnabled);
  };

  useEffect(() => {
    fetchSites();
  }, []);
  return (
    <div>
      <h2>ScreenShare Guard</h2>
      <p>Blur sensitive content on website while screen sharing</p>
      <Paper
        className="global-switch"
        style={{ backgroundColor: globalEnabled ? '#10ac84' : '#ee5253' }}
      >
        <h3>
          ScreenShare guard is currently{' '}
          {globalEnabled ? 'enabled' : 'disabled'}
        </h3>
        <p>Please refresh the sites for changes to take effect.</p>
        <GreenSwitch
          edge="end"
          onChange={() => toggleGlobal()}
          checked={globalEnabled}
          inputProps={{
            'aria-labelledby': 'switch-list-label-bluetooth',
          }}
        />
      </Paper>
      <div>
        <h3>Add a new Site</h3>
        <p>
          Add websites that may contain sensitive data. Websites in this list
          will be blurred while screen sharing.
        </p>
        <form
          className="new-site-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (newSite) {
              addSite(newSite);
            }
          }}
        >
          <TextField
            className="new-site-text"
            value={newSite}
            error={!!newSiteError}
            onChange={(e) => {
              setNewSiteError('');
              setNewSite(e.target.value);
            }}
            label="Site hostname"
            helperText={
              newSiteError ||
              `Please don't use "http/https" and just include the hostname instead of the entire URL. For ex. just use www.google.com`
            }
            variant="outlined"
          />
          <Fab
            disabled={!newSite}
            color="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              console.log(newSite);
              if (newSite) {
                addSite(newSite);
              }
            }}
          >
            <AddIcon />
          </Fab>
        </form>
      </div>
      <div>
        <h3>Current List</h3>
        <SiteList
          sites={sites}
          onToggle={(host) => toggleSite(host)}
          onDelete={(host) => deleteSite(host)}
        />
      </div>
    </div>
  );
};

export default ScreenShare;
