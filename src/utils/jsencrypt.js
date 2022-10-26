import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
// 加密
export function encrypt(txt, keyPair) {
  if (!keyPair) {
    return txt;
  }
  const encryptor = new JSEncrypt()
  // 设置公钥
  encryptor.setPublicKey(keyPair.publicKey) 
  // 对数据进行加密
  return keyPair.prefix + encryptor.encrypt(txt) + keyPair.suffix
}

// 解密
export function decrypt(txt, keyPair) {
  if (!keyPair) {
    return txt;
  }
  var prefixLen = 0;
  var suffixLen = 0;
  if (keyPair.suffix) {
    suffixLen = keyPair.suffix.length;
  }
  if (keyPair.prefix) {
    prefixLen = keyPair.prefix.length;
  }
  if (prefixLen > 0) {
    txt = txt.slice(prefixLen, -suffixLen);
  }
  const encryptor = new JSEncrypt()
  // 设置私钥
  encryptor.setPrivateKey(keyPair.privateKey) 
  // 对数据进行解密
  return encryptor.decrypt(txt) 
}
