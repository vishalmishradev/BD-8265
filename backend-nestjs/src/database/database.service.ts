import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_OPTIONS } from './constant';
import type { DatabaseModuleOptions } from './interface/database-options.interface';

@Injectable()
export class DatabaseService {
  private dbConnection: any;

  constructor(
    @Inject(DATABASE_OPTIONS) private options: DatabaseModuleOptions,
  ) {
    this.connectToDatabase(options);
  }

  private connectToDatabase(options: DatabaseModuleOptions) {
    console.log(`Connecting to database: ${options.dbName}`);
  }
}
