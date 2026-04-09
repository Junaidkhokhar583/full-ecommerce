import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy,} from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config:ConfigService, @InjectRepository(User)
        private userRepo: Repository<User>,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_KEY')!, 
        });
    }

   async validate(payload: {sub:number;email:string}) {
    const res = await this.userRepo.findOneBy({id:payload.sub,})

        const {Hash, ...user } = res ?? {};
      return user;
  }
}