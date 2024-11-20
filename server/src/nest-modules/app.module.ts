import { Module } from '@nestjs/common';

import { DatabaseModule } from './database';
import { PingModule } from './ping';
import { SharedModule } from './shared';

@Module({ imports: [DatabaseModule, SharedModule, PingModule] })
export class AppModule {}
