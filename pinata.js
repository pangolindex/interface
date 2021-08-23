const pinataSDK = require('@pinata/sdk');
require('dotenv').config({ path: '.env.local' })
const pinataKey = process.env.IPFS_DEPLOY_PINATA__API_KEY
const pinataSecret = process.env.IPFS_DEPLOY_PINATA__SECRET_API_KEY
const pinata = pinataSDK(pinataKey, pinataSecret);
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');

pinata.testAuthentication().then((result) => {
  //handle successful authentication here
  console.log(result);
}).catch((err) => {
  //handle error here
  console.log(err);
});

let shortsha = require('child_process')
  .execSync('git rev-parse --verify HEAD --short')
  .toString().trim()

let branch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString().trim()

console.log(branch,'branch')

const pinDirectoryToIPFS = (pinataApiKey, pinataSecretApiKey) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const src = './build';

  recursive.readdirr(src, function (err, dirs, files) {
    let data = new FormData();
    files.forEach((file) => {
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file)
      });
    });

    const metadata = JSON.stringify({
      name: 'png-interface-'+shortsha,
      keyvalues: {
        commit: shortsha,
        branch: branch,
        time: new Date()
      }
    });
    data.append('pinataMetadata', metadata);

    return axios
      .post(url, data, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey
        }
      })
      .then(function (response) {
        //handle response here
        console.log('success')
      })
      .catch(function (error) {
        //handle error here
        console.log('upload error', error)
      });
  });
};

pinDirectoryToIPFS(pinataKey, pinataSecret)