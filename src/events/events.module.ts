import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeeService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee])
    ],
    controllers: [
        EventsController,
        CurrentUserEventAttendanceController,
        EventAttendeesController,
        EventsOrganizedByUserController
    ],
    providers: [EventsService, AttendeeService]
})
export class EventsModule {}
