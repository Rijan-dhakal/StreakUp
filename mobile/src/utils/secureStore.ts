import * as SecureStore from 'expo-secure-store';

export async function saveToken(key:string, token: string) {
  await SecureStore.setItemAsync(key, token);
}

export async function getToken(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function removeToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}
