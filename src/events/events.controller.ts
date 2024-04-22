import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list.events";

@Controller('/events')
export class EventsController{
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>, 

        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,

        private readonly eventsService: EventsService
    ){}

    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    async findAll(@Query() filter: ListEvents){
        this.logger.log(`GET: FIND ALL ROUTE`);

        const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
            filter,
            {
                total: true,
                currentPage: filter.page,
                limit:2
            }
        );

        return events;
    }

    @Get('practice2')
    async practice2() {
        // return await this.repository.findOne({
        //     where: {
        //         id: 1
        //     },
        //     relations: ['attendees']
        // });

        //#1 get event

        // const event = await this.repository.findOneBy({
        //     id: 1
        // })

        //#2 get event

        // const event = new Event();
        // event.id = 1;

        // const event = await this.repository.findOne({
        //     where: {
        //         id: 1
        //     },
        //     relations: ['attendees']
        // });

        // const attendee = new Attendee();

        // attendee.name = 'Using cascade';
        // attendee.event = event;

        // event.attendees.push(attendee);

        //await this.attendeeRepository.save(attendee);
        // await this.repository.save(event)
        // return event;

        return await this.repository.createQueryBuilder('e')
            .select(['e.id', 'e.name'])
            .orderBy('e.id', 'DESC')
            .take(3)
            .getMany();
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        this.logger.log(`GET: FIND ONE ROUTE`);
         
        const event = await this.eventsService.getEvent(id);

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

        const result = await this.eventsService.delete(id);
        
        if(result?.affected !== 1)
            throw new NotFoundException();
    }
}