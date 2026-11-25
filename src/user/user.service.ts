import { Injectable } from '@nestjs/common';
import { LoggerService } from './user.logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface User {
    id: number;
    name: string;
    email: string;
}

@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) { }

    private users: User[] = [
        { id: 1, name: "amit", email: "amit@gmail.com" },
        { id: 2, name: "shubham", email: "shubham@gmail.com" },
    ]

    findAllUsers(name: String = '') {
        this.logger.log('Finding all users')

        return this.users.filter((user) => user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
    }

    findOneUser(id: number) {
        this.logger.log(`Finding user by id ${id}`)

        return this.users.filter((user) => user.id == id)
    }

    createUser(dto: CreateUserDto) {
        this.logger.log('Creating user')

        const newuser: User = { id: this.users.length + 1, ...dto }
        this.users.push(newuser)

        return { data: dto, message: "User created successfully!" }
    }

    updateUser(id: number, dto: UpdateUserDto) {
        this.logger.log(`Updating user ${id}`)

        this.users = this.users.map((user) => user.id == id ? { ...user, ...dto } : user)

        return { data: { id, ...dto }, message: "User updated successfully!" }
    }

    deleteUser(id: number) {
        this.logger.log(`Deleting user ${id}`)

        this.users = this.users.filter((user) => user.id !== id)

        return { message: "User deleted successfully!" }
    }
}
