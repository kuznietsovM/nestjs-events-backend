import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('/events')
export class EventsController{

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>
    ){}

    @Get()
    async findAll(){
        return await this.repository.find();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        console.log(typeof id);
        return await this.repository.findOneBy({id: id});
    }

    @Post()
    async create(@Body() input: CreateEventDto){
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto){
        const event = await this.repository.findOneBy({id: id})

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id){
        const event = await this.repository.findOneBy({id: id});
        await this.repository.remove(event);
    }
}