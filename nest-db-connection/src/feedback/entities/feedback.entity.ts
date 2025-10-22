import { Event } from "../../events/entities/event.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";


@Entity('feedbacks')
export class Feedback {
    @PrimaryGeneratedColumn()
    feedback_id: number;

    @Column({type: 'int'})
    rating: number;

    @Column({type: 'text'})
    comments: string; 
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    // events & Users relationship
    @ManyToOne(() => User, (user) => user.feedback)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => Event, (event) => event.feedback)
    @JoinColumn({name: 'event_id'})
    event: Event;
}

