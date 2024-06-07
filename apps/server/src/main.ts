import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FARM API')
    .setDescription('API for farm management app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  console.log(document);
  SwaggerModule.setup('api', app, document);
  writeFileSync('api.schema.json', JSON.stringify(document));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
