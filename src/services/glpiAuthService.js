// services/glpiAuthService.js

const axios = require('axios');
const querystring = require('querystring');

const GLPI_API_URL = 'https://chamados.bugbusters.me/apirest.php/';
const GLPI_APP_TOKEN = 'rNkCgKqtRIfBmY2mVi3zXOhPSXvkYPGSDh4sIuPe';
const GLPI_USER_LOGIN = 'diego.teixeira';
const GLPI_USER_PASSWORD = 'Diego1310';


const getSessionToken = async () => {
  try {
    const url = `${GLPI_API_URL}initSession`;
    const headers = {
      'Content-Type': 'application/json',
      'App-Token': GLPI_APP_TOKEN,
    };
    const body = {
      login: GLPI_USER_LOGIN,
      password: GLPI_USER_PASSWORD,
    };

    const response = await axios.post(url, body, { headers });

    // A resposta da API contém o Session-Token
    const sessionToken = response.data.session_token;

    if (!sessionToken) {
      throw new Error('O Session-Token não foi encontrado na resposta da API.');
    }

    console.log('Session-Token obtido com sucesso.');
    return sessionToken;
  } catch (error) {
    console.error('Erro ao obter o Session-Token:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a API do GLPI.');
  }
};

module.exports = { getSessionToken };