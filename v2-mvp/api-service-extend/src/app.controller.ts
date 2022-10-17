import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { FileUploadDto } from './viewModel/base/FileUploadDto';



@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) { }


}
