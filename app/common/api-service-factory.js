// returns an Angular Service function that saves API request data
// and only fetches on initial get

function ApiServiceFactory(url) {
  function ApiService($http, $q) {
    this.$http = $http;
    this.$q = $q;
    this.url = url;
    this.data = null;
  }

  ApiService.prototype.get = function() {
    return this.$q((resolve, reject) => {
      if (!this.data) {
        return this.fetchData()
          .then(data => {
            this.data = data;
            return data;
          })
          .then(resolve)
          .catch(reject);
      } else {
        return resolve(this.data);
      }
    });
  };

  ApiService.prototype.fetchData = function() {
    return this.$http.get(this.url).then(res => res.data);
  };

  ApiService.$inject = ["$http", "$q"];

  return ApiService;
}

export default ApiServiceFactory;