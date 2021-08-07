import * as fse from 'fs-extra';
import * as path from 'path';
import * as util from 'util';

import * as readline from 'readline';
import { google } from 'googleapis';


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve(__dirname, 'token.json');

export class GoogleDrive {

  public async start() {
    try {
      // Load client secrets from a local file.
      const credentials = await fse.readJson(path.resolve(__dirname, 'credentials.json'));

      return this.authorize(credentials);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  public async getFileByName(auth, name: string) {
    const files = await this.listFiles(auth) || [];

    return files.find(file => file.name === name);
  }

  public async downloadFile(auth, fileId: string) {
    const drive = google.drive({ version: 'v3', auth });

    try {
      return drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    } catch(e) {
      console.error(e);
    }
  }

  /**
   * Lists the names and IDs.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  public async listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});

    try {
      const response = await drive.files.list({ fields: 'nextPageToken, files(id, name)' });
      const files = response.data.files || [];

      return files;
    } catch(e) {
      console.log('The API returned an error: ' + e);
    }
  }


  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  private async authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
      // Check if we have previously stored a token.
      const token = await fse.readJson(TOKEN_PATH);

      if (this.isTokenExpired(token.expiry_date)) {
        return this.getAccessToken(oAuth2Client);
      }

      oAuth2Client.setCredentials(token);

      return oAuth2Client;
    } catch(e) {
      return this.getAccessToken(oAuth2Client);
    }
  }


  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   */
  private getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const getTokenAsync = util.promisify(oAuth2Client.getToken.bind(oAuth2Client));

    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', async (code) => {
        rl.close();

        const decodeString = decodeURIComponent(code);

        try {
          const token = await getTokenAsync(decodeString);

          oAuth2Client.setCredentials(token);

          await fse.writeJson(TOKEN_PATH, token);

          console.log('Token stored to', TOKEN_PATH);

          resolve(oAuth2Client);
        } catch(e) {
          reject(`Error retrieving access token ${e}`);
        }
      });
    });
  }

  private isTokenExpired(expiryDate: number): boolean {
    const now = new Date().getTime();

    return now > expiryDate;
  }
}