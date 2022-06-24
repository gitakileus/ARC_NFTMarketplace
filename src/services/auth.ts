import { Web3Provider } from '@ethersproject/providers';
import Axios, { AxiosInstance } from 'axios';
import { Buffer } from 'buffer';
import { IPerson } from 'interfaces/IPerson';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/activity`;
export default class AuthService {
  private static api: AxiosInstance = Axios.create({ baseURL: API_BASE_URL });

  private static JWT_KEY = '@nft.arc.market:jwt';

  static async verifyAuth(jwt?: string): Promise<boolean> {
    let token = localStorage.getItem(this.JWT_KEY);
    token = jwt ?? token;
    if (token) {
      try {
        await this.api.get('ws/v2/user/auth', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch {}
    }
    return false;
  }

  static async authorize(provider: Web3Provider, walletId: string) {
    try {
      const { data } = await this.api.get(`ws/v2/user/${walletId}/auth-message`);
      const message = Buffer.from(data.message, 'hex').toString('utf-8');
      const signature = await provider.getSigner().signMessage(message);
      if (signature) {
        const { data } = await this.api.post('ws/v2/user/auth', { walletId, signature });
        const { user, jwt } = data;

        localStorage.setItem(this.JWT_KEY, jwt);
        const verified = await this.verifyAuth(jwt);

        if (verified) {
          return { jwt };
        }
      }
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  static async getUser(walletId: string): Promise<IPerson> {
    const { data } = await this.api.get(`ws/v2/nft/owners/${walletId}`);
    const user: IPerson = data.data;
    return user;
  }

  static async logout() {
    localStorage.removeItem(this.JWT_KEY);
  }
}
