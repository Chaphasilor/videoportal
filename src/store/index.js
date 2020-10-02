import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/assets/js/api.js';
import DownloadItem from '@/assets/js/download-item.js';

Vue.use(Vuex)

// HELPER METHODS

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

const VIEWS = {
  PROGRESS: 0,
  DOWNLOAD: 1,
  DOWNLOAD_DETAILS: 2,
  LOGIN: 3,
}

export default new Vuex.Store({
  state: {
    api: undefined,
    activeView: VIEWS.PROGRESS,
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
    downloads: [],
    authenticated: undefined,
    swRegistration: undefined,
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
    }
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
        api = new API(`http://localhost:70`);
      }

      context.commit(`SET_API`, api);
      
    },
    navigate(context, { target }) {
      switch (target) {
        case 'Progress':
          context.commit('SET_ACTIVE_VIEW', VIEWS.PROGRESS);
          break;
        case 'Download':
          context.commit('SET_ACTIVE_VIEW', VIEWS.DOWNLOAD);
          break;
        case 'DownloadDetails':
          context.commit('SET_ACTIVE_VIEW', VIEWS.DOWNLOAD_DETAILS);
          break;
        case 'Login':
          context.commit('SET_ACTIVE_VIEW', VIEWS.LOGIN);
          break;
      
        default:
          context.commit('SET_ACTIVE_VIEW', VIEWS.PROGRESS);
          break;
      }
    },
    nativgateToDownload(context) {
      context.commit('SET_ACTIVE_VIEW', VIEWS.DOWNLOAD);
    },
    async checkAuthenticated(context) {

      console.log('checkAuthenticated called!');
      
      try {
        let success = await context.getters.api.checkAuthenticated();
        console.log(`success:`, success);
      } catch (err) {
        console.warn(err);
        context.commit('SET_AUTH_STATUS', false);
        return err.message;
      }

      context.commit('SET_AUTH_STATUS', true);
      
      return `Success`;
      
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
    createNewDirectory(context, path, name) {
      //TODO create via API
      console.log(`path:`, path);
      console.log(`name:`, name);
      context.actions.loadRootDirectoryTree();
    },
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

      console.log(`downloads:`, downloads);

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

      let vapidPublicKey;
      try {
        vapidPublicKey = await context.getters.api.retrieveVapidKey();
      } catch (err) {
        return false;
      }
      
      console.log(vapidPublicKey);
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
      
    }
  },
  getters: {
    api: state => state.api,
    activeView: state => {
      let view;
      switch (state.activeView) {
        case VIEWS.PROGRESS:
          view = 'Progress';
          break;
        case VIEWS.DOWNLOAD:
          view = 'Download';
          break;
        case VIEWS.DOWNLOAD_DETAILS:
          view = 'DownloadDetails';
          break;
        case VIEWS.LOGIN:
          view = 'Login';
          break;
      
        default:
          view = 'Progress';
          break;
      }
      return view;
    },
    rootDirectoryTree: state => state.rootDirectoryTree,
    downloads: state => state.downloads,
    authStatus: state => state.authenticated,
    sw: state => state.swRegistration,
  }
})
