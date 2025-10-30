import { Registration } from "../../registrations/entities/registration.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from "typeorm";

export enum PaymentsStatus {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed'
}

export enum PaymentMethod {
    Card = 'Credit-Card',
    PayPal = 'PayPal',
    Mpesa = 'Mpesa'
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({type: 'datetime2'})
    payment_date: Date;

    @Column({
        type: 'varchar',
        length: 10,
        default: PaymentsStatus.Pending
    })
    payment_status: PaymentsStatus;

    @Column({type: 'decimal', precision: 10, scale: 2})
    amount:number; 

    @Column({
        type: 'varchar', 
        length: 255, 
        default: PaymentMethod.Mpesa })
    payment_method: PaymentMethod
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    // registrations relationships
    @OneToOne(() => Registration, (registration) => registration.payment)
    @JoinColumn({name: 'registration_id'})
    registration: Registration

}
