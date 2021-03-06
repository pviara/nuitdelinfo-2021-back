import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from './monitoring.service';
import { RepositoryService } from './repository.service';
import { AccountController } from '../controllers/account.controller';
import { RescueController } from '../controllers/rescue.controller';

export class ControllerService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _accountController = <AccountController>{};
  private _rescueController = <RescueController>{};

  get accountController() {
    return this._accountController;
  }

  get rescueController() {
    return this._rescueController;
  }

  get monitor() {
    return this._monitor;
  }

  constructor(private _rpService: RepositoryService) {
    this._setupControllers();
  }

  private _setupControllers() {
    this._monitor.log(LogType.pending, 'Setting up controllers...');

    this._accountController = new AccountController(this._rpService.accountRepository);
    this._rescueController = new RescueController(this._rpService.rescueRepository);

    this._monitor.log(LogType.passed, 'Set up controllers');
  }
}