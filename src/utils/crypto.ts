import CryptoJS from "crypto-js";
import sha256 from "sha256";
import md5 from "md5";

const key1 = "102_53_100_57_54_53_100_102_55_53_51_51_54_50_55_48"
  .split("_")
  .map(a => String.fromCharCode(parseInt(a)))
  .join("");

const key2 = "57_55_98_54_48_51_57_52_97_98_99_50_102_98_101_49"
  .split("_")
  .map(a => String.fromCharCode(parseInt(a)))
  .join("");

const keyy = "cc99ddc9357ff461e08f047aedee692b";

const vii = "e89290cfbbimgkcu";

const appkey = "cc99ddc9357ff461e08f047aedee692b";

const media_key = CryptoJS.enc.Utf8.parse(key1);
const media_iv = CryptoJS.enc.Utf8.parse(key2);
const key = CryptoJS.enc.Utf8.parse(keyy);
const iv = CryptoJS.enc.Utf8.parse(vii);

function getSign(obj) {
  const keyValues = [];
  if (typeof obj.data !== "undefined") {
    keyValues.push(`client=${obj.client}`);
  }
  if (typeof obj.data !== "undefined") {
    keyValues.push(`data=${obj.data}`);
  }
  if (typeof obj.errcode !== "undefined") {
    keyValues.push(`errcode=${obj.errcode}`);
  }
  if (typeof obj.timestamp !== "undefined") {
    keyValues.push(`timestamp=${obj.timestamp}`);
  }
  const text = keyValues.join("&") + appkey;
  const sha256Text = sha256(text);
  const md5Text = md5(sha256Text);
  return md5Text;
}

const _hh = "72_101_120"
  .split("_")
  .map(a => String.fromCharCode(parseInt(a)))
  .join("");

const _asd =
  "A327BBD523E47D713316A44B1FD1CDECF46D88C913E0DA6ED822BE6B8C371654853734EDCB9E37F92CAB19EE0C7DD7788BD528ED25BE080A10F7AC5AD7E7D824BA3C4D6AD7C8121AF6DC0D9CCC92E5E48C3445E2875FFC671AC6550D4993FD34F2DF2CBE6DC3391A25415346BBC0257646B7C8828B15DBE34974A805D605B6138CC3302B7025B12823969D421E390B6ADA9FD9E9FD69B6950671DD05";
function Decrypt(word) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedStr.toString());
}

function DecryptImage(word) {
  const decrypt = CryptoJS.AES.decrypt(word, media_key, {
    iv: media_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Base64);
  return decryptedStr;
}

function DecryptVideo(word) {
  const decrypt = CryptoJS.AES.decrypt(word, media_key, {
    iv: media_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr;
}

function Encrypt(word) {
  // console.log(')))))))))')
  // console.log(Decrypt(asd))
  // console.log(')))))))))')
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  }).ciphertext;
  const data = encrypted;
  const unix_t = new Date().getTime() / 1000;
  const timestamp = parseInt(unix_t.toString());
  const sign = getSign({ client: "web", data, timestamp });
  return { client: "web", sign, timestamp, data };
}

function Rc4Decrypt(encryptedByteArray, key) {
  // create RC4 encryption instance
  const rc4 = CryptoJS.algo.RC4.createEncryptor(CryptoJS.enc.Utf8.parse(key));

  // encrypt the data
  const encryptedData = rc4.process(
    CryptoJS.lib.WordArray.create(encryptedByteArray)
  );
  const encryptedBytes = new Uint8Array(encryptedData.words.length * 24);
  for (let i = 0; i < encryptedData.words.length; i++) {
    encryptedBytes[i * 4] = (encryptedData.words[i] >> 24) & 0xff;
    encryptedBytes[i * 4 + 1] = (encryptedData.words[i] >> 16) & 0xff;
    encryptedBytes[i * 4 + 2] = (encryptedData.words[i] >> 8) & 0xff;
    encryptedBytes[i * 4 + 3] = encryptedData.words[i] & 0xff;
  }

  return encryptedBytes;
}

const CryptoData = {
  Decrypt,
  DecryptImage,
  DecryptVideo,
  Encrypt,
  Rc4Decrypt
};

export default CryptoData;
