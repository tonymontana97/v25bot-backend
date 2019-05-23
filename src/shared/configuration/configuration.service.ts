import { Injectable } from '@nestjs/common';
import { EConfiguration } from './configuration.enum';
import { get } from 'config';

@Injectable()
export class ConfigurationService {
  static connectionString: string = process.env[EConfiguration.MONGO_URI] || get(EConfiguration.MONGO_URI);
  private environmentHosting: string = process.env.NODE_ENV || 'development';

  get(name: string): string {
    return process.env[name] || get(name);
  }

  get isDevelopment(): boolean {
    return this.environmentHosting === 'development';
  }
}
