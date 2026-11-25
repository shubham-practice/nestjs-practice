import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // GET
    @Get()
    getUsers(@Query('name') name: String, @Query('id') id: Number): unknown {
        // const users = [
        //     { id: 1, name: "Amit" },
        //     { id: 2, name: "Shubham" },
        // ]

        // if (name) {
        //     return users.filter((user) => user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
        // }

        // if (id) {
        //     return users.filter((user) => user.id == id)
        // }

        // return users

        return this.userService.findAllUsers(name);
    }

    // GET by id
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): unknown {
        // return {
        //     id,
        //     name: "Amit"
        // }

        return this.userService.findOneUser(id)
    }

    // POST
    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        // return { data: createUserDto, message: "User created successfully!" }

        return this.userService.createUser(createUserDto)
    }

    // PUT
    @Put(':id')
    updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        // return { data: { id, ...updateUserDto }, message: "User updated successfully!" }

        return this.userService.updateUser(id, updateUserDto)
    }

    // DELETE
    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id)
    }
}
