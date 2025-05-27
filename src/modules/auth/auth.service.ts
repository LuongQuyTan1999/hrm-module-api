import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '../../common/db/entities/user.entity';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: EntityRepository<Users>,
    private readonly em: EntityManager,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<Users> {
    const { email, password, fullName, role } = signupDto;

    const existingUser = await this.userRepository.findOne({ email }); // this.em.findOne(Users, { email })
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      role,
    });

    // await this.userRepository.insert(user); // this.em.persist(user);
    await this.em.persistAndFlush(user);

    return user;
  }

  async signin(signinDto: SigninDto): Promise<{ token: string; user: Users }> {
    const { email, password } = signinDto;

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }
}
