import axios from 'axios';

export default axios.create({
  baseURL: 'http://api.lesgardiensdelalegende.fr:3000/v1/',
  timeout: 10000,
});

