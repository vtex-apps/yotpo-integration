/* eslint-disable spaced-comment */
import { IOClients } from '@vtex/api'

import OMSClient from './oms'
import RequestHub from '../utils/Hub'
import YotpoClient from './yotpo'
import ProfileClient from './profile'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get hub() {
    return this.getOrSet('hub', RequestHub)
  }

  public get oms() {
    return this.getOrSet('orders', OMSClient)
  }

  public get yotpo() {
    return this.getOrSet('yotpo', YotpoClient)
  }

  public get profile() {
    return this.getOrSet('profile', ProfileClient)
  }
}
