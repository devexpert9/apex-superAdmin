import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class User extends BaseModel {
  id: number;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  pic: string;
  name: string;
  description: string;
  price: number;
  message: string;
  timePeriod: string;
  position: string;
  fullname: string;
  occupation: string;
  companyName: string;
  phone: string;
  address: Address;
  image: string;
  socialNetworks: SocialNetworks;

  clear(): void {
    this.id = undefined;
    this.username = '';
    this.password = '';
    this.image = '';
    this.email = '';
    this.roles = [];
    this.fullname = '';
    this.name = '';
    this.accessToken = 'access-token-' + Math.random();
    this.refreshToken = 'access-token-' + Math.random();
    this.pic = './assets/media/users/default.jpg';
    this.occupation = '';
    this.companyName = '';
    this.phone = '';

    this.message = '';
    this.timePeriod = '';
    this.position = '';
    


    this.address = new Address();
    this.address.clear();
    this.socialNetworks = new SocialNetworks();
    this.socialNetworks.clear();
  }
}
