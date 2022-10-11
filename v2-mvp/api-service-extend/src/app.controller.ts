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
  //API for sharing metadata on twitter 
  @Get('/twittershare')
  @ApiOperation({ summary: 'twitter share metadata' })
  twitterShare(@Query('meta') meta: string): string {

    meta = (decodeURIComponent(decodeURIComponent(meta)));
    let split = meta.split(",");
    let metaHtml = "";
    let url = '';
    for (var i = 0; i < split.length; i++) {
      metaHtml += "<meta property=\"" + split[i] + "\" name=\"" + split[i] + "\" content=\"" + split[i + 1] + "\"/>\n";

      if (split[i] == 'twitter:url') {
        url = split[i + 1];
      }

      i++;
    }
    var retHtml = "<!DOCTYPE html>\n"
      + "<html lang=\"en\">\n"
      + "<head>\n"
      + metaHtml
      + "</head>\n"
      + "<body>\n"
      + "<script type=\"text/javascript\">\n"
      + "\twindow.location.href=\"" + url + "\";\n"
      + "</script>"
      + "</body>\n"
      + "</html>";
    console.log(retHtml);

    return retHtml;

  }

  //API for uploading image and returning the path
  @Post('imgUpload')
  @ApiOperation({ summary: 'upload img and return the path' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  imgUpload(@UploadedFile() file, @Body() body) {
    // console.log(body);
    // console.log(file);

    let dir = join(__dirname, '/imgUpload');
    // console.log(dir);

    if (existsSync(dir) == false) {
      mkdirSync(dir);
    }

    let path = (new Date()).getTime() + file.originalname.substr(file.originalname.indexOf('.'));
    const writeImage = createWriteStream(join(dir, `${path}`))
    writeImage.write(file.buffer);
    console.log("imgUpload path:", path);

    return path;
  }


}
