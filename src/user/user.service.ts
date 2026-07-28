import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}
    addUser(){
        return "User added successfully";
    }

    async findUserById(userId: string){
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })

        return user;
    }
}
