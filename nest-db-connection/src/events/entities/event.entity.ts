import { Feedback } from "../../feedback/entities/feedback.entity";
import { Registration } from "../../registrations/entities/registration.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    event_id: number;

    @Column({type: 'nvarchar', length: 255})
    event_name: string;
    
    @Column({type: 'datetime2'})
    event_date:Date;

    @Column({type: 'nvarchar', length: 255})
    event_location: string;

    @Column({type: 'nvarchar', length: 255})
    event_description:string;
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    // created by relationship
    @OneToMany(() => Feedback, (feedback) => feedback.event)
    feedback: Feedback;

    @OneToMany(()=> Registration, (registration) => registration.event)
    registration: Registration;

    @ManyToOne(() => User, (user) => user.event)
    @JoinColumn({name: 'created_by'})
    created_by: User;
}