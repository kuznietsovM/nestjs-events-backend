import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list.events";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";

@Controller('/events')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsController{
    private readonly logger = new Logger(EventsController.name);

    constructor(
        private readonly eventsService: EventsService
    ){}

    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    @UseInterceptors(ClassSerializerInterceptor)
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

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number){
        this.logger.log(`GET: FIND ONE ROUTE`);
         
        const event = await this.eventsService.getEventWithAttendeeCount(id);

        if(!event)
            throw new NotFoundException();

        return event;
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Body() input: CreateEventDto, @CurrentUser() user: User){
        this.logger.log(`POST: CREATE ROUTE`);
        return await this.eventsService.createEvent(input, user);
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id', ParseIntPipe) id, 
        @Body() input: UpdateEventDto,
        @CurrentUser() user: User
    ){
        this.logger.log(`PATCH: UPDATE ROUTE`);
        const event = await this.eventsService.findOne(id);

        if(!event)
            throw new NotFoundException();

        if(event.organaizerId !== user.id)
            throw new ForbiddenException(null, `You are not authorize to change this event`);

        return await this.eventsService.updateEvent(event, input);
    }

    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id,
        @CurrentUser() user: User
    ){
        this.logger.log(`DELETE: REMOVE ROUTE`);

        const event = await this.eventsService.findOne(id);

        if(!event)
            throw new NotFoundException();

        if(event.organaizerId !== user.id)
            throw new ForbiddenException(null, `You are not authorize to delete this event`);
        

        await this.eventsService.delete(id);
    }
}