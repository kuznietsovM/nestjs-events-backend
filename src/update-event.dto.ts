import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";

//all properties are optional
export class UpdateEventDto extends PartialType(CreateEventDto){}