import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export async function configDB(configService:ConfigService, isProd:boolean = false){
    const dbConfig:TypeOrmModuleOptions={
        ssl:isProd,
        extra:{
            rejectUnauthorized:false
        },
        type:"mysql",
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        entities: [__dirname + "/../**/*.entity.{ts,js}"],
        autoLoadEntities:true,
        synchronize:true
    };
    return dbConfig
}

