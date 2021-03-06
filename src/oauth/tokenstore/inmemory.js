'use strict';

import moment from 'moment';

class TokenStore {
  static requiredOptions() {
    return [];
  }

  constructor(config = {}) {
    this.clients = config.clients || {};
    this.tokens = config.tokens || {};
  }


  /**
   * Ping backend.
   */
  ping() {
    return Promise.resolve();
  }


  /**
   * Stores a client key-value pair.
   * @param clientId
   * @param clientSecret
   */
  storeClient(clientId, clientSecret) {
    const clients = this.clients;

    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      clients[clientId] = clientSecret;
      resolve();
    });
  }


  /**
   * Gets a client if the client exists.
   * @param clientId
   * @param clientSecret
   * @returns {Promise}
   */
  getClient(clientId, clientSecret) {
    const clients = this.clients;

    return new Promise(function (resolve, reject) {
      var actualClientSecret = clients[clientId];

      if (actualClientSecret === clientSecret) {
        resolve(actualClientSecret);
      }
      else {
        reject();
      }
    });
  }


  /**
   * Stores a set of accessToken
   * @param accessToken
   * @param clientId
   * @param expires
   * @param user
   */
  storeAccessToken(accessToken, clientId, expires, user) {
    const tokens = this.tokens;

    tokens[accessToken] = {
      clientId: clientId,
      userId: user.id,
      expires: expires.toISOString()};

    return Promise.resolve();
  }


  /**
   * Gets a promise that contains the token variables for a given accessToken (bearerToken)
   * @param bearerToken
   * @returns {Promise}
   */
  getAccessToken(bearerToken) {
    const tokens = this.tokens;

    return new Promise(function (resolve, reject) {
      var result = tokens[bearerToken];
      if (typeof result === 'undefined') {
        reject(new Error('token not found'));
      }

      result.expires = moment(result.expires).toDate();

      if (result.expires > (new Date())) {
        result.accessToken = bearerToken;
        resolve(result);
      }
      else {
        reject(new Error('token expired'));
      }
    });
  }
}


export default TokenStore;
