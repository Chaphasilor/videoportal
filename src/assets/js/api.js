export default class API {

  constructor(baseUrl) {

    this.baseUrl = baseUrl;
    this.apiEndpoint = `${this.baseUrl}/api`;
    this.pushEndpoint = `${this.baseUrl}/push`;
    
  }

  async retrieveVapidKey() {

    let res;
    try {
      
      res = await fetch(`${this.pushEndpoint}/vapidPublicKey`, {
        method: `GET`,
        mode: `cors`,
        credentials: `include`,
      });

    } catch (err) {
      throw new Error(`Couldn't retrieve VAPID key!`);
    }

    try {
      let vapidKey = await res.text();
      return vapidKey
    } catch (err) {
      throw new Error(`Failed to parse VAPID key!`);
    }

  }

  async submitPushSubscription(pushSubscription) {

    let res;
    try {
      
      res = await fetch(`${this.pushEndpoint}/register`, {
        method: `post`,
        mode: `cors`,
        credentials: `include`,
        headers: {
          'Content-type': `application/json`
        },
        body: JSON.stringify({
          subscription: pushSubscription,
        })
      })

      return res.status === 201;
      
    } catch (err) {
      
      console.error(`Couldn't submit push subscription:`, err);
      return false;
      
    }
    
    
  }

  async checkAuthenticated() {

    let res, result;
    
    try {
      
      res = await fetch(this.baseUrl + `/auth/check`, {
        method: `GET`,
        mode: `cors`,
        credentials: `include`,
      })

    } catch (err) {
      console.error(`Something went wrong during authentication!`);
      throw new Error(`Couldn't authenticate!`);
    }

    try {
      result = await res.json();
    } catch (err) {
      console.error(`Something went wrong during authentication!`);
      throw new Error(`Couldn't authenticate!`);
    }

    if (result.success) {
      return true;
    } else {
      throw new Error(`Authentication failed! Cookie seems to be missing...`);
    }
    
  }
  
  async authenticate(username, password) {
    
    let res, result;
    
    try {
      
      res = await fetch(this.baseUrl + `/auth/local`, {
        mode: `cors`,
        method: `POST`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })

    } catch (err) {
      console.error(`Something went wrong during authentication!`);
      throw new Error(`Couldn't authenticate!`);
    }

    try {
      result = await res.json();
    } catch (err) {
      console.error(`Something went wrong during authentication!`);
      throw new Error(`Couldn't authenticate!`);
    }

    if (result.success) {
      return true;
    } else {
      throw new Error(`Authentication failed! Maybe wrong password?`);
    }
    
  }

  loadProgress() {
    return new Promise((resolve, reject) => {

        fetch(this.apiEndpoint + `/progress`, {
          mode: `cors`,
          method: `GET`,
          credentials: `include`,
          headers: {
            'Content-Type': `application/json`,
          },
        })
        .then(response => {
          return response.json();
        })
        .then(result => {
          return resolve(result.downloads);
        })
        .catch(err => {
          console.warn(`Failed to fetch progress:`, err);
          // respond with empty progress object
          return reject([
            {
              name: `Failed to load progress!`,
              status: `failed`,
            },
          ])
          // return reject(`Couldn`t fetch progress!`);
        })
    
    })
  }

  loadDownloadItem(id) {
    return new Promise((resolve, reject) => {

      fetch(this.apiEndpoint + `/downloads/${id}`, {
        mode: `cors`,
        method: `GET`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
      })
      .then(response => {
        return response.json();
      })
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        console.error(err);
        return reject(`An error occured during the request!`);
      })
    
    })
  }

  submitDownload(download) {
    return new Promise((resolve, reject) => {
    
      download.mkdir = true; // enable creation of new folders (directories are fetched from the API, so this shouldn`t cause any issues)
      
      fetch(this.apiEndpoint + `/download`, {
        mode: `cors`,
        method: `POST`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify(download)
      })
      .then(async response => {
        
        console.log(`response.status:`, response.status);
        
        return {
          status: response.status,
          info: await response.json(),
        }
        
      })
      .then(result => {

        switch (result.status) {
          case 200:
            return resolve(result.info);
          case 201:
            return resolve(result.info);
          case 400:
            return reject(result.info);
          case 500:
            return reject(result.info);
            
          default:
            return reject(result.info);
        }
        
      })
      .catch(err => {
        console.error(err);
        return reject(`An error occurred during the request!`);
      })
    
    })
  }

  pauseDownload(id) {
    return new Promise((resolve, reject) => {
    
      fetch(this.apiEndpoint + `/download/${id}`, {
        mode: `cors`,
        method: `PATCH`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          action: `pause`,
        })
      })
      .then(response => {
        return response.text();
      })
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        console.error(err);
        return reject(`An error occurred during the request!`);
      })
    
    })
  }

  resumeDownload(id) {
    return new Promise((resolve, reject) => {
    
      fetch(this.apiEndpoint + `/download/${id}`, {
        mode: `cors`,
        method: `PATCH`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          action: `resume`,
        })
      })
      .then(response => {
        return response.text();
      })
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        console.error(err);
        return reject(`An error occured during the request!`);
      })
    
    })
  }

  stopDownload(id) {
    return new Promise((resolve, reject) => {
    
      fetch(this.apiEndpoint + `/download/${id}`, {
        mode: `cors`,
        method: `PATCH`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          action: `stop`,
        })
      })
      .then(response => {
        return Boolean(response.text());
      })
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        console.error(err);
        return reject(`An error occured during the request!`);
      })
    
    })
  }

  async fetchRootDirectoryTree() {

    let res;

    try {
      
      res = await fetch(this.apiEndpoint + `/directoryListing`, {
        mode: `cors`,
        method: `GET`,
        credentials: `include`,
      });

    } catch (err) {
      console.error(`Failed to fetch directory listing:`, err);
    }

    return res.json();
    
  }

  async resolveUrl(url) {

    let res;

    try {
      
      res = await fetch(this.apiEndpoint + `/resolve/`, {
        mode: `cors`,
        method: `POST`,
        credentials: `include`,
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({
          url: url,
        })
      });

    } catch (err) {
      console.error(`Failed to resolve URL:`, err);
    }

    if (200 == res.status) {
      return res.json();
    } else {
      throw new Error(`Failed to resolve URL, server responded with status ${res.status}`);
    }
    
    
  }
  
}