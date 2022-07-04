import axios from "axios";

// BaseApiService create http client with basic configurations and error handling.
class BaseApiService {
  constructor(
    domain,
    commonHeaders = {},
    timeout = 1000,
    withCredentials = false
  ) {
    if (!domain) throw new Error("Domain is not provided");
    this.domain = domain;
    this.client = axios.create({
      headers: {
        common: commonHeaders,
      },
      baseURL: domain,
      timeout: timeout, // `timeout` specifies the number of milliseconds before the request times out.
      withCredentials: withCredentials,
    });
    this.client.interceptors.response.use(
      this.responseInterceptor,
      this.errorInterceptor
    );
  }
  // interceptor to catch network/server errors.
  errorInterceptor(error) {
    // check if it's a server error
    if (!error.response) {
      if (error.code == "ECONNABORTED") {
        // timeout
        alert("Something went wrong. Please try again.");
      }
    }
    throw error;
  }

  // Interceptor for responses
  responseInterceptor = (response) => response;

  // handleError is used to log http errors.
  handleErrors(error) {
    if (!error.request) {
      console.log({ "Http server/network error": error });
      return;
    }
    console.log({
      message: "Errors in http call",
      url: error.request.responseURL,
      err: error,
    });
  }

  async post(resource, payload = {}) {
    try {
      const response = await this.client.post(resource, payload);
      return response.data;
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async patch(resource, payload = {}) {
    try {
      const response = await this.client.patch(resource, payload);
      return response.data;
    } catch (err) {
      this.handleErrors(err);
    }
  }

  async get(resource) {
    try {
      const response = await this.client.get(resource);
      if (!response) {
        return {};
      }
      return response.data;
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

// MayaApiService inherits BaseApiService to create http clients for Maya services.
class MayaApiService extends BaseApiService {
  constructor(flavour) {
    let mayaDomain = "https://maya.parkspot.in"; //TODO: we can pick from .env files.
    let baseHeaderMap = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Flavour: flavour,
    };
    super(mayaDomain, baseHeaderMap, 5000, true);
  }

  // errorInterceptor is used to handle status codes in accordance with Maya's contract.
  errorInterceptor(error) {
    super.errorInterceptor(error);
    if (!error.response) {
      // this case is handled in base interceptor.
      return;
    }
    switch (error.response.status) {
      case 401: // authentication error, logout the user
        alert("Please login and try again.");
        break;

      default:
        alert(
          "Something went wrong.\nNo worries, our team is always there to help. \nPlease reach out to us at +91 80929 96057."
        );
        console.error(
          "maya interceptor default",
          error.response.status,
          error.message
        );
    }
    throw error;
  }
}

function getFlavour() {
  const details = navigator.userAgent;
  const regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(details);

  if (isMobileDevice) {
    return "mweb";
  } else {
    return "dweb";
  }
}

const mayaClient = new MayaApiService(getFlavour());

export { mayaClient };
