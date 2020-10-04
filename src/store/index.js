import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/assets/js/api.js';
import DownloadItem from '@/assets/js/download-item.js';

Vue.use(Vuex)

// HELPER METHODS

// eslint-disable-next-line no-unused-vars
function detachedCopy(reactiveObject) {
  return JSON.parse(JSON.stringify(reactiveObject));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const store = new Vuex.Store({
  strict: true,
  state: {
    api: undefined,
    activeView: undefined,
    rootDirectoryTree: {
      name: 'ROOT',
      subdirectories: [
        {
          name: 'Backups',
          subdirectories: [
            {
              name: 'OnePlus 5',
              subdirectories: [],
            },
            {
              name: 'Raspberry Pi',
              subdirectories: [],
            },
            {
              name: 'Spectre',
              subdirectories: [],
            },
          ]
        },
        {
          name: 'Documents',
          subdirectories: [
            {
              name: 'Uni',
              subdirectories: [],
            },
            {
              name: 'Unsorted',
              subdirectories: [],
            },
            {
              name: 'Work',
              subdirectories: [],
            },
          ]
        },
        {
          name: 'Media',
          subdirectories: [
            {
              name: 'eBooks',
              subdirectories: [],
            },
            {
              name: 'Movies',
              subdirectories: [],
            },
            {
              name: 'Music',
              subdirectories: [],
            },
            {
              name: 'Pictures',
              subdirectories: [
                {
                  name: 'Wallpapers',
                  subdirectories: [],
                },
              ],
            },
            {
              name: 'TV Shows',
              subdirectories: [
                {
                  name: 'Altered Carbon (2018)',
                  subdirectories: [],
                },
                {
                  name: 'Cloak and Dagger (2018)',
                  subdirectories: [
                    {
                      name: 'S1',
                      subdirectories: [],
                    },
                    {
                      name: 'S2',
                      subdirectories: [],
                    },
                  ],
                },
                {
                  name: 'Dark (2017)',
                  subdirectories: [
                    {
                      name: 'Season 1',
                      subdirectories: [],
                    },
                    {
                      name: 'Season 2',
                      subdirectories: [],
                    },
                    {
                      name: 'Season 3',
                      subdirectories: [],
                    },
                  ],
                },
                {
                  name: 'Dark Matter (2015)',
                  subdirectories: [
                    {
                      name: 'Season 1',
                      subdirectories: [],
                    },
                    {
                      name: 'Season 2',
                      subdirectories: [],
                    },
                    {
                      name: 'Season 3',
                      subdirectories: [],
                    },
                  ],
                },
              ],
            },
          ]
        },
        {
          name: 'Misc',
          subdirectories: [
            {
              name: 'Code',
              subdirectories: [],
            },
            {
              name: 'Jam Session',
              subdirectories: [],
            },
          ]
        },
      ]
    },
    downloads: [
      new DownloadItem({
        id: "9f1f5063-f916-4abb-810b-6e31da4b446e",
        status: "downloading",
        url: "https://example.com",
        downloadUrl: "https://example.com",
        name: "Star.Wars.Resistance.S01E09.720p.HEVC.x265-MeGusta.mkv",
        dest: "Media/TV Shows/Star Wars - Resistance (2018)/Season 1/",
        customHeaders: {
        referer: "hashhackers.com",
        cookie: ""
        },
        percentage: "70.00",
        eta: "10/1/2020, 11:22:10 PM",
        size: "168.43 MB",
        downloaded: "168.43 MB",
        startDate: "2020-10-01T21:19:59.959Z",
        speed: null,
        retries: 0,
        resumable: false
      }),
      new DownloadItem({
        id: "9f1f5063-f916-4abb-810b-6e31da4jdsoen",
        status: "downloading",
        url: "https://example.com",
        downloadUrl: "https://example.com",
        name: "Star.Wars.Resistance.S01E09.720p.HEVC.x265-MeGusta.mkv",
        dest: "Media/TV Shows/Star Wars - Resistance (2018)/Season 1/",
        customHeaders: {
        referer: "hashhackers.com",
        cookie: ""
        },
        percentage: "70.00",
        eta: "10/1/2020, 11:22:10 PM",
        size: "168.43 MB",
        downloaded: "168.43 MB",
        startDate: "2020-10-01T21:19:59.959Z",
        speed: null,
        retries: 0,
        resumable: false
      }),
      new DownloadItem({
        id: "9f1f5063-f916-4abb-810b-6e31da4naztn",
        status: "downloading",
        url: "https://example.com",
        downloadUrl: "https://example.com",
        name: "Star.Wars.Resistance.S01E09.720p.HEVC.x265-MeGusta.mkv",
        dest: "Media/TV Shows/Star Wars - Resistance (2018)/Season 1/",
        customHeaders: {
        referer: "hashhackers.com",
        cookie: ""
        },
        percentage: "70.00",
        eta: "10/1/2020, 11:22:10 PM",
        size: "168.43 MB",
        downloaded: "168.43 MB",
        startDate: "2020-10-01T21:19:59.959Z",
        speed: null,
        retries: 0,
        resumable: false
      }),
    ],
    authenticated: undefined,
    swRegistration: undefined,
    settings: {
      notifications: {
        title: `Push Notifications`,
        description: `Receive push notifications when a download is finished or there is a problem downloading a file`,
        value: false,
        timeout: 500,
        onChange: async (newSetting) => {

          if (newSetting.value) {
            // if subscribing doesn't work (i.e. user declines permission, the setting is disabled)
            newSetting.value = await store.dispatch(`subscribeToPush`);
          } else {
            newSetting.value = !await store.dispatch(`unsubscribePush`);
          }
          store.dispatch(`updateSetting`, newSetting)
          
        }
      },
      test: {
        title: `Test Setting`,
        value: true,
        timeout: 350,
        onChange: (newSetting) => {
          store.dispatch(`updateSetting`, newSetting);
        }
      },
      test2: {
        title: `Test Setting 2`,
        value: false,
        timeout: 600,
        onChange: (newSetting) => {
          store.dispatch(`updateSetting`, newSetting);
        }
      },
    }
  },
  mutations: {
    SET_API(state, newApi) {
      state.api = newApi;
    },
    SET_ACTIVE_VIEW(state, view) {
      state.activeView = view;
    },
    SET_ROOT_DIRECTORY_TREE(state, newRootDirectoryTree) {
      state.rootDirectoryTree = newRootDirectoryTree;
    },
    SET_DOWNLOADS(state, newDownloads) {
      state.downloads = newDownloads;
      console.log(`newDownloads:`, newDownloads);
    },
    CHANGE_DOWNLOAD_STATUS(state, { downloadId, newDownloadStatus }) {

      let download = state.downloads.find(x => x.id === downloadId);

      if (download) {
        download.status = newDownloadStatus;
      }

    },
    SET_AUTH_STATUS(state, newStatus) {
      state.authenticated = newStatus;
    },
    SET_SERVICEWORKER_REGISTRATION(state, newRegistration) {
      state.swRegistration = newRegistration;
    },
    SET_SETTING(state, { settingName, value }) {
      state.settings[settingName].value = value;
    },
  },
  actions: {
    async mountApi(context) {

      let response;
      let baseUrl = `https://web-services.chaphasilor.xyz/njoy/tunnel`;
      let api;

      try {
        response = await fetch(`https://web-services.chaphasilor.xyz/url?type=njoy`);
        baseUrl = await response.text();
      } catch (err) {
        console.error(`Failed to fetch base url, using proxy:`, err);
      }

      console.log(`baseUrl:`, baseUrl);
      
      // set api urls depending on mode
      if (process.env.NODE_ENV === `production`) {
        api = new API(baseUrl);
      } else {
        api = new API(`http://192.168.2.129:70`);
      }

      context.commit(`SET_API`, api);
      
    },
    navigate(context, { target }) {
      context.commit('SET_ACTIVE_VIEW', target);
    },
    async checkAuthenticated(context) {

      context.commit('SET_AUTH_STATUS', true);
      return;
      
      // console.log('checkAuthenticated called!');
      
      // try {
      //   await context.getters.api.checkAuthenticated();
      // } catch (err) {
      //   console.warn(err);
      //   context.commit('SET_AUTH_STATUS', false);
      //   return err.message;
      // }

      // context.commit('SET_AUTH_STATUS', true);
      
      // return `Success`;
      
    },
    async authenticateApi(context, { username, password }) {

      try {
        await context.getters.api.authenticate(username, password);
      } catch (err) {
        console.warn(err);
        context.commit('SET_AUTH_STATUS', false);
        return err.message;
      }

      context.commit('SET_AUTH_STATUS', true);
      
      return `Success`;
      
    },
    async loadRootDirectoryTree(context) {
      let tree;
      
      try {
        tree = await context.getters.api.fetchRootDirectoryTree();
      } catch (err) {

        console.error(`Couldn't get root directory tree from API!`, err);
        tree = {
          name: `ROOT`,
          subdirectories: [],
        }
        
      }

      context.commit('SET_ROOT_DIRECTORY_TREE', tree);

    },
    //TODO rename
    createNewDummyDirectory(context, { path, name, newRootDirectoryTree }) {
      console.log(`path:`, path);
      console.log(`name:`, name);
      console.log(`newRootDirectoryTree:`, newRootDirectoryTree);
      context.commit('SET_ROOT_DIRECTORY_TREE', newRootDirectoryTree);
    },
    async fetchProgress(context) {

      let downloads;
      
      try {
        downloads = await context.getters.api.loadProgress();
      } catch (emptyObject) {
        console.warn(`Couldn't fetch data from API, using empty object...`);
        downloads = emptyObject;
      }

      downloads = [...downloads.active,...downloads.queued, ...downloads.finished, ...downloads.failed];

      downloads = downloads.map(item => new DownloadItem(item));

      context.commit('SET_DOWNLOADS', downloads);
      
    },
    async modifyDownloadState(context, { id, action }) {

      let newStatus;
      
      try {

        switch (action) {
          case `pause`:
            newStatus = await context.getters.api.pauseDownload(id);
            break;
          case `resume`:
            newStatus = await context.getters.api.resumeDownload(id);
            break;
          case `stop`:
            newStatus = await context.getters.api.stopDownload(id);
            break;
        
          default:
            throw new Error(`Action '${action}' not supported!`);
        }

        context.commit(`CHANGE_DOWNLOAD_STATUS`, {
          downloadId: id,
          newDownloadStatus: newStatus,
        })

      } catch (err) {

        console.error(`Couldn't ${action} download ${id}:`, err);
        
      }

    },
    async submitDownload(context, download) {

      console.log(`download.path:`, download.path);
      
      let response;

      try {
        response = await context.getters.api.submitDownload(download);
      } catch (err) {
        console.error(`Failed to submit download:`, err);
        throw new Error(`Failed to submit download!`);
      }

      return response;
      
    },
    async getFileSize(context, url) {

      let size;
      
      try {
        size = await context.getters.api.fetchFileSize(url);
      } catch (err) {
        
        console.warn(`Couldn't fetch the file size for the given URL through the API:`, err);
        size = `Unknown`;
        
      }

      return size;
      
    },
    saveServiceWorkerRegistration(context, registration) {

      context.commit(`SET_SERVICEWORKER_REGISTRATION`, registration);
      console.log(`Received Service Worker registration:`, registration);
      
    },
    async subscribeToPush(context) {

      // if (process.env.NODE_ENV !== `production`) {
      //   return true;
      // }

      let vapidPublicKey;
      try {
        vapidPublicKey = await context.getters.api.retrieveVapidKey();
      } catch (err) {
        return false;
      }
      
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      try {
        
        let pushSubscription = await context.getters.sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        })
        console.log(pushSubscription.endpoint);
  
        let success = await context.getters.api.submitPushSubscription(pushSubscription);

        return success;

      } catch (err) {
        console.error(`Couldn't subcribe client to push:`, err);
        return false;
      }
      
    },
    async unsubscribePush(context) {

      if (process.env.NODE_ENV !== `production`) {
        return true;
      }

      let pushSubscription = await context.getters.sw.pushManager.getSubscription();

      if (null === pushSubscription) {
        return true;
      } else {
        return await pushSubscription.unsubscribe();
      }
      
      
    },
    //TODO move to a separate store
    updateSetting(context, { settingName, value }) {

      context.commit(`SET_SETTING`, { settingName, value});
      context.dispatch(`persistSettings`);
      
    },
    persistSettings(context) {

      let settings = JSON.parse(JSON.stringify(context.getters.settings));
      settings = Object.entries(settings);
      settings = settings.map(([key, value]) => {
        return {
          name: key,
          value: value.value,
        }
      })

      localStorage.setItem(`settings`, JSON.stringify(settings));
      
    },
    resurrectSettings(context) {

      let resurrectedSettings = localStorage.getItem(`settings`);
      if (resurrectedSettings) {
        try {

          resurrectedSettings = JSON.parse(resurrectedSettings);

          // overwrite any settings that was saved with the saved value
          resurrectedSettings.forEach(resurrectedSetting => {
            context.dispatch(`updateSetting`, {
              settingName: resurrectedSetting.name,
              value: resurrectedSetting.value,
            });
          });

        } catch (err) {
          console.warn(`Couldn't resurrect settings!`);
        }
      }
      
    },
  },
  getters: {
    api: state => state.api,
    activeView: state => state.activeView,
    rootDirectoryTree: state => state.rootDirectoryTree,
    downloads: state => state.downloads,
    authStatus: state => state.authenticated,
    sw: state => state.swRegistration,
    settings: state => state.settings,
  }
})
export default store;
