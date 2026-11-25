import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    // GET
    @Get()
    getUsers(@Query('name') name: String, @Query('id') id: Number) {
        const users = [
            { id: 1, name: "Amit" },
            { id: 2, name: "Shubham" },
        ]

        if (name) {
            return users.filter((user) => user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
        }

        if (id) {
            return users.filter((user) => user.id == id)
        }

        return users
    }

    // GET by id
    @Get(':id')
    getUser(@Param('id') id: string) {
        return {
            id,
            name: "Amit"
        }
    }

    // POST
    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return { data: createUserDto, message: "User created successfully!" }
    }

    // PUT
    @Put(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return { data: { id, ...updateUserDto }, message: "User updated successfully!" }
    }

}
