import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import dns from "dns";


dns.setDefaultResultOrder("ipv4first"); 

@Module({
  
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      
      useFactory: async (config:ConfigService) => {
        // In dev (`nest start --watch`) templates live under `src/`.
        // Using an absolute path avoids "dist/src/..." missing-template crashes.
        const templatesDir = join(process.cwd(), 'src', 'mail', 'templates');

        console.log(config.get('E_HOST'));
        console.log(config.get('E_USER'));
        console.log(config.get('E_PASS'));
       
        return {
          transport: {
            host: config.get('E_HOST'),
            port: 587,  
            secure: false,
            auth: {
              user: config.get('E_USER'),
              pass: config.get('E_PASS'),
            },
            tls: {
              rejectUnauthorized: false,
            },
            family: 4
            // connectionTimeout: 20000,
            // greetingTimeout: 20000,
            // socketTimeout: 20000,
            // pool: true,
            // maxConnections: 5,
            // maxMessages: 100,
          },
          template: {
           dir: templatesDir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
          defaults: {
            from: config.get('MAIL_FROM'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MailerConfigModule {}