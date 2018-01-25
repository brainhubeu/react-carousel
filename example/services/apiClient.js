import _ from 'lodash';
import superagent from 'superagent';
import config from 'constants/config';

const ApiClient = {
  formatUrl(path) {
    return `${config.apiClient.protocol}://${config.apiClient.host}:${config.apiClient.port}/v${config.apiClient.apiVersion}/${path.replace(/^\//, '')}`;
  },
  performRequest(method) {
    return (path, { params, data, headers } = {}) => new Promise((resolve, reject) => {
      const request = superagent[method](this.formatUrl(path));

      request.timeout(5000);

      if (params) {
        request.query(params);
      }
      if (data) {
        request.send(data);
      }

      if (_.isPlainObject(headers)) {
        _.forEach(headers, (headerValue, headerName) => {
          request.set(headerName, headerValue);
        });
      }

      request.end((err, res) => {
        if (res) {
          if (res.ok) {
            return resolve({
              statusCode: res.statusCode,
              title: res.statusText,
              body: res.body,
              res,
            });
          }
          return reject({
            statusCode: res.statusCode,
            title: res.statusText,
            message: res.body && typeof(res.body) !== 'string' ? res.body.message : null,
            details: res.body && res.body.details ? res.body.details : null,
            res,
          });
        }
        return reject({
          statusCode: 503,
          title: 'Service unavailable',
          message: 'Service unavailable',
        });
      });
    });
  },
  get(path, { params, data, headers } = {}) {
    return this.performRequest('get')(path, { params, data, headers });
  },
  post(path, { params, data, headers } = {}) {
    return this.performRequest('post')(path, { params, data, headers });
  },
  patch(path, { params, data, headers } = {}) {
    return this.performRequest('patch')(path, { params, data, headers });
  },
  put(path, { params, data, headers } = {}) {
    return this.performRequest('put')(path, { params, data, headers });
  },
  del(path, { params, data, headers } = {}) {
    return this.performRequest('del')(path, { params, data, headers });
  },
};

export default ApiClient;
