import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('/events')
export class EventsController{
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>
    ){}

    @Get()
    async findAll(){
        this.logger.log(`GET: FIND ALL ROUTE`);

        const events = await this.repository.find();

        this.logger.debug(`Found ${events.length} events`);

        return events;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        this.logger.log(`GET: FIND ONE ROUTE`);
         
        const event = await this.repository.findOneBy({id: id});

        if(!event)
            throw new NotFoundException();

        return event;
    }

    @Post()
    async create(@Body() input: CreateEventDto){
        this.logger.log(`POST: CREATE ROUTE`);
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto){
        this.logger.log(`PATCH: UPDATE ROUTE`);
        const event = await this.repository.findOneBy({id: id})

        if(!event)
            throw new NotFoundException();

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id){
        this.logger.log(`DELETE: REMOVE ROUTE`);
        const event = await this.repository.findOneBy({id: id});

        if(!event)
            throw new NotFoundException();

        await this.repository.remove(event);
    }
}