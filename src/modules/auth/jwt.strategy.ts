import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { jwtConstants } from 'src/common/constants';
import { Users } from '../../common/db/entities/user.entity';

// Define a clear interface for the user payload
interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Users)
    private userRepository: EntityRepository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserPayload | null> {
    const user = await this.userRepository.findOne(
      { id: payload.sub },
      {
        populate: ['employee'],
      },
    );
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.employee.getEntity().email,
      role: user.role,
    };
  }
}
