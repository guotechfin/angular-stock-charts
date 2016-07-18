// abstract class for an API request service
// only fetches on initial get or on API changes, stores data after

class ApiRequestService {
  constructor($http, $q, apiSelector) {
    if (new.target === ApiRequestService) {
      throw new Error("Cannot instantiate ApiService directly (abstract class)");
    }
    if (!this.getUrl) {
      throw new Error("Must implement getUrl and specify API url (abstract method)");
    }
    this.$http = $http;
    this.$q = $q;
    this.apiSelector = apiSelector;

    this.data = false;
    this.fetching = false;
  }
  get() {
    if (this.fetching) {
      return this.fetching;
    }
    // get() will configure itself to API changes automatically
    // so client code does not need to call onUpdateApi
    const api = this.apiSelector.getApi();
    if (this.api !== api) {
      this.api = api;
      this.onUpdateApi(api);
      this.data = false;
    }
    return this.fetching = this.$q((resolve, reject) => {
      if (!this.data) {
        return this.fetchData()
          .then(data => this.formatData(data))
          .then(data => {
            this.data = data;
            this.fetching = false;
            return resolve(data);
          })
          .catch(reject);
      }
      return resolve(this.data);
    });
  }
  onUpdateApi(api) {
    return api; // default implementation, does nothing
  }
  fetchData() {
    return this.$http.get(this.getUrl()).then(res => res.data);
  }
  formatData(data) {
    return data; // default implementation, no formatting
  }
}

ApiRequestService.$inject = ["$http", "$q", "apiSelector"];

export default ApiRequestService;