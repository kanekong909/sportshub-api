import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [AdminController, SeasonController],
  providers: [AdminService, SeasonService],
})
export class AdminModule {}
