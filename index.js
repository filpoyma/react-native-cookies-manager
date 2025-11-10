/**
 * Copyright (c) Joseph P. Ferraro
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file here: https://github.com/joeferraro/react-native-cookies/blob/master/LICENSE.md.
 */

import { NativeModules, Platform } from 'react-native';
const invariant = require('invariant');
const RNCookieManagerIOS = NativeModules.RNCookieManagerIOS;
const RNCookieManagerAndroid = NativeModules.RNCookieManagerAndroid;

let CookieManager;

if (Platform.OS === 'ios') {
  invariant(
    RNCookieManagerIOS,
    'react-native-cookies-manager: Add RNCookieManagerIOS.h and RNCookieManagerIOS.m to your Xcode project',
  );
  CookieManager = RNCookieManagerIOS;
} else if (Platform.OS === 'android') {
  invariant(
    RNCookieManagerAndroid,
    'react-native-cookies-manager: Import libraries to android "react-native link react-native-cookies-manager"',
  );
  CookieManager = RNCookieManagerAndroid;
} else {
  invariant(
    CookieManager,
    'react-native-cookies-manager: Invalid platform. This library only supports Android and iOS.',
  );
}

const functions = ['setFromResponse', 'getFromResponse'];

const cookieManager = {
  getAll: (useWebKit = false) => CookieManager.getAll(useWebKit),
  clearAll: (useWebKit = false) => CookieManager.clearAll(useWebKit),
  get: (url, useWebKit = false) => CookieManager.get(url, useWebKit),
  set: (url, cookie, useWebKit = false) =>
    CookieManager.set(url, cookie, useWebKit),
  clearByName: (url, name, useWebKit = false) =>
    CookieManager.clearByName(url, name, useWebKit),
  flush: async () => {
    if (Platform.OS === 'android') {
      await CookieManager.flush();
    }
  },
  removeSessionCookies: async () => {
    if (Platform.OS === 'android') {
      return await CookieManager.removeSessionCookies();
    }
    return false;
  },
};

// Add platform-specific methods
functions.forEach((functionName) => {
  cookieManager[functionName] = CookieManager[functionName];
});

module.exports = cookieManager;
