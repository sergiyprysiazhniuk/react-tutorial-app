import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-tutorial-app-8b51d.firebaseio.com/'
});

export default instance;