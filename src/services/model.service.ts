import { Connection } from 'mongoose';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from './monitoring.service';
import {
  RescueDocument,
  RescueModel
} from '../model/mongoose/rescue/rescue.types';
import rescueSchema from '../model/mongoose/rescue/rescue.schema';
import {
  UserDocument,
  UserModel
} from '../model/mongoose/user/user.types';
import userSchema from '../model/mongoose/user/user.schema';

export class ModelService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  get models() {
    return [
      this._connection.model('rescue'),
      this._connection.model('user')
    ];
  }

  constructor(private _connection: Connection) {}

  async setupModels() {
    this._monitor.log(LogType.pending, 'Initializing mongoose models...');

    this._connection?.model<RescueDocument>('rescue', rescueSchema) as RescueModel;
    this._connection?.model<UserDocument>('user', userSchema) as UserModel;

    this._connection
      .modelNames()
      .forEach(name => {
        this.monitor.log(LogType.passed, `Initialized mongoose model '${name}'`);
      });
  }
}