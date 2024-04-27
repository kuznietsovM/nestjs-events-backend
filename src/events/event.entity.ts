import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";
import { User } from "src/auth/user.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    when: Date;

    @Column()
    address: string;

    @OneToMany(()=> Attendee, (attendee) => attendee.event,
    {
        cascade: true // ["insert", "update"]
    }
    // load all relations
    // {
        // eager: true
    // }
)
    attendees: Attendee[];

    @ManyToOne(() => User, (user) => user.organaized)
    @JoinColumn({name: 'organaizerId'})
    organaizer: User;

    @Column({nullable:true})
    organaizerId:number;

    attendeeCount?: number;

    attendeeRejected?: number;
    attendeeMaybe?: number;
    attendeeAccepted?: number;
}