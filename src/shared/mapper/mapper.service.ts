import 'automapper-ts/dist/automapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {

  mapper: AutoMapperJs.AutoMapper;

  constructor() {
    this.mapper = automapper;
    this.initMapper();
  }

  private initMapper(): void {
    this.mapper.initialize(MapperService.configure);
  }

  private static configure(config: AutoMapperJs.IConfiguration): void {
    config.createMap('User', 'UserVmModel')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('password', opts => opts.ignore());

    config.createMap('Account', 'AccountVmModel')
      .forSourceMember('_id', opts => opts.ignore());

    config.createMap('Account[]', 'AccountVmModel[]')
      .forSourceMember('_id', opts => opts.ignore());
  }
}
