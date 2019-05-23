import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const hostDomain: string = AppModule.host ? `${AppModule.host}:${AppModule.port}` : AppModule.host;

  const swaggerOptions = new DocumentBuilder()
    .setTitle('v25 Bot')
    .setDescription('Api documentation')
    .setVersion('1.0.0')
    .setHost(hostDomain.split('//')[1])
    .setSchemes(AppModule.isDev ? 'http' : 'https')
    .setBasePath('/api')
    .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  app.use('/api/docs/swagger.json', (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup('/api/docs', app, null, {
    swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      showRequestDuration: true,
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(AppModule.port);
}

bootstrap();
