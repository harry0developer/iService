import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class NetworkProvider {
  constructor(private network: Network) { }

  isDisconnected() {
    return this.network.onDisconnect();
  }

  isConnected() {
    return this.network.onConnect();
  }
}
