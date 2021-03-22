/* eslint-disable spaced-comment */
import { IOClients } from '@vtex/api'

import OMSClient from './oms'
import RequestHub from '../utils/Hub'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get hub() {
    return this.getOrSet('hub', RequestHub)
  }

  public get oms() {
    return this.getOrSet('orders', OMSClient)
  }

  //Yotpo Client
}
