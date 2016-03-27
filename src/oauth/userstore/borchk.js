'use strict';

import {log} from '../../utils';
import BorchkServiceClient from 'dbc-node-borchk';

export default class UserStore {
  static requiredOptions() {
    return ['wsdl', 'serviceRequester'];
  }

  constructor(config) {
    this.config = config;

    this.borchkClient = new BorchkServiceClient({
      wsdl: this.config.wsdl,
      serviceRequester: this.config.serviceRequester
    });
    log.info('initialized Borchk client', this.config);
  }

  ping() {
    // TODO: Do something meaningful here
    return Promise.resolve();
  }

  getUser (username, password) {
    log.info('borchk.getUser', {user: username});

    var xs = username.split('$', 2);
    var libraryId = xs[0];
    var userId = xs[1];

    const borchkRequest = {
      userId: userId,
      userPincode: password,
      libraryCode: libraryId
    };

    return this.borchkClient.getBorrowerCheckResult(borchkRequest)
      .then((reply) => {
        const isAuthenticated = reply.requestStatus === 'ok';
        log.info('borchk.getUser', {user: username, authenticated: isAuthenticated});
        return isAuthenticated ? {id: username} : false; // TODO: is username/cpr the right userid?
      })
      .catch((err) => {
        return err;
      });
  }
}