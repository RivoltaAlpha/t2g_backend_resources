import { Event } from "../../events/entities/event.entity";
import { Payment } from "../../payments/entities/payment.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, CreateDateColumn } from "typeorm";


export enum PaymentStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed'
}

@Entity('registrations')
export class Registration {
    @PrimaryGeneratedColumn()
    registration_id: number;

    @Column({type: 'datetime2'})
    registration_date: Date;

    @Column({
        type: 'varchar',
        length: 10,
        default: PaymentStatus.Pending
    })
    payment_status: PaymentStatus;

    @Column({type: 'decimal', precision: 10, scale: 2})
    payment_amount:number; 
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    // events and user relationships
    @OneToOne(() => Payment, (payment) => payment.registration)
    payment: Payment

    @ManyToOne(() => Event, (event) => event.registration)
    @JoinColumn({name: 'event_id'})
    event: Event;

    @ManyToOne(() => User, (user) => user.registration)
    @JoinColumn({name: 'user_id'})
    user: User;
}

