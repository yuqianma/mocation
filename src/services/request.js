import store from '../store';

export const request = async (url, options = {}) => {
  options.headers = {
    'Content-Type': 'application/json',
    'X-LC-Id': process.env.VUE_APP_LC_ID,
    'X-LC-Key': process.env.VUE_APP_LC_KEY,
    'X-LC-Session': store.state.user.sessionToken,
    ...options.headers,
  };
  if (options.data) {
    options.body = JSON.stringify(options.data);
    delete options.data;
  }
  
  try {
    const response = await fetch(process.env.VUE_APP_API_BASE_URL + url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw json;
    }
  } catch (error) {
    store.commit('setErrorMsg', error);
  }
};
