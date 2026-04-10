import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    addUser(){
        return "User added successfully";
    }
}
