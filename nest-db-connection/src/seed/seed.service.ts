import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import {
  Payment,
  PaymentMethod,
  PaymentsStatus,
} from 'src/payments/entities/payment.entity';
import {
  PaymentStatus,
  Registration,
} from 'src/registrations/entities/registration.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async seedDatabase(): Promise<void> {
    this.logger.log('Seeding Database');
    await this.seedUsers();
    await this.seedEvents();
    await this.seedFeedbacks();
    await this.seedRegistrations();
    await this.seedPayments();
  }

  async seedUsers(): Promise<void> {
    this.logger.log('Seeding Users');

    try {
      const users: User[] = [];
      const userCount = 10;

      for (let i = 0; i < userCount; i++) {
        const user = new User();
        user.name = faker.person.fullName();
        user.email = faker.internet.email();
        user.password = faker.internet.password();
        user.phone = faker.phone.number();
        user.role = UserRole.User;
        user.hashedRefreshedToken = '';
        users.push(user);
      }
      await this.userRepository.save(users);
      this.logger.log('Seeded Users Succesfully');
    } catch (error) {
      this.logger.error(`Error seeding users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedEvents(): Promise<void> {
    this.logger.log('Seeding Events');

    try {
      const users = await this.userRepository.find();
      if (users.length === 0) {
        throw new Error('No users Found');
      }
      const events: Event[] = [];
      const eventCount = 10;

      for (let i = 0; i < eventCount; i++) {
        const event = new Event();
        event.created_by = faker.helpers.arrayElement(users);
        event.event_name = faker.lorem.sentence(3);
        event.event_description = faker.lorem.paragraph(2);
        event.event_date = faker.date.future();
        event.event_location = faker.location.city().substring(0, 100);
        events.push(event);
      }
      await this.eventRepository.save(events);
      this.logger.log('Seeded Events Succesfully');
    } catch (error) {
      this.logger.error(`Error seeding events: ${error.message}`, error.stack);
      throw error;
    }
  }

  async seedFeedbacks(): Promise<void> {
    this.logger.log('Seeding Feedbacks');

    try {
      const users = await this.userRepository.find();
      const events = await this.eventRepository.find();
      if (users.length === 0 || events.length === 0) {
        throw new Error('No users or events Found');
      }
      const feedbacks: Feedback[] = [];
      const feedbackCount = 10;

      for (let i = 0; i < feedbackCount; i++) {
        const feedback = new Feedback();
        feedback.user = faker.helpers.arrayElement(users);
        feedback.event = faker.helpers.arrayElement(events);
        feedback.comments = faker.lorem.sentence();
        feedback.rating = faker.number.int({ min: 1, max: 5 });
        feedbacks.push(feedback);
      }
      await this.feedbackRepository.save(feedbacks);
      this.logger.log('Seeded Feedbacks Succesfully');
    } catch (error) {
      this.logger.error(
        `Error seeding Feedbacks: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async seedRegistrations(): Promise<void> {
    this.logger.log('Seeding Registrations');

    try {
      const users = await this.userRepository.find();
      const events = await this.eventRepository.find();
      if (users.length === 0 || events.length === 0) {
        throw new Error('No users or events Found');
      }
      const registrations: Registration[] = [];
      const registrationsCount = 10;

      for (let i = 0; i < registrationsCount; i++) {
        const registration = new Registration();
        registration.user = faker.helpers.arrayElement(users);
        registration.event = faker.helpers.arrayElement(events);
        registration.registration_date = faker.date.future();
        registration.payment_amount = faker.number.float({
          min: 300,
          max: 2500,
        });
        registration.payment_status = PaymentStatus.Pending;
        registrations.push(registration);
      }
      await this.registrationRepository.save(registrations);
      this.logger.log('Seeded Registrations Succesfully');
    } catch (error) {
      this.logger.error(
        `Error seeding Registrations: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async seedPayments(): Promise<void> {
    this.logger.log('Seeding Payments');

    try {
      const registrations = await this.registrationRepository.find();
      if (registrations.length === 0) {
        throw new Error('No Registrations Found');
      }

      const unpaidReg = await this.registrationRepository
        .createQueryBuilder('registration')
        .leftJoinAndSelect('registration.payment', 'payment')
        .where('payment.payment_id IS NULL')
        .getMany();

      if (unpaidReg.length === 0) {
        this.logger.log('All registrations have payments');
      }

      const payments: Payment[] = [];
      const paymentsCount = Math.min(unpaidReg.length, 10);

      const selectedReg = faker.helpers.arrayElements(unpaidReg, paymentsCount);

      for (const registration of selectedReg) {
        const payment = new Payment();
        payment.registration = registration;
        payment.amount = faker.number.float({ min: 300, max: 2500 });
        payment.payment_date = faker.date.recent();
        payment.payment_status = PaymentsStatus.Pending;
        payment.payment_method = PaymentMethod.Mpesa;

        payments.push(payment);
      }
      await this.paymentRepository.save(payments);
      this.logger.log('Seeded Payments Succesfully');
    } catch (error) {
      this.logger.error(
        `Error seeding Payments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // clearDatabase() method
  //  Truncates the db
  async clearDatabase(): Promise<void> {
    try {
      // Use query runner to disable foreign key checks and clear tables
      const queryRunner =
        this.userRepository.manager.connection.createQueryRunner();

      await queryRunner.connect();

      try {
        // Disable foreign key constraints
        await queryRunner.query(
          'EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"',
        );

        // Delete data from all tables in reverse dependency order
        await queryRunner.query('DELETE FROM payments');
        await queryRunner.query('DELETE FROM registrations');
        await queryRunner.query('DELETE FROM feedbacks');
        await queryRunner.query('DELETE FROM events');
        await queryRunner.query('DELETE FROM users');

        // Re-enable foreign key constraints
        await queryRunner.query(
          'EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"',
        );

        this.logger.log('Database cleared successfully');
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error(
        `Error clearing database: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  // // clearDatabase() method
  // async clearDatabase(): Promise<void> {
  //   try {
  //     // Delete in reverse order to handle foreign key constraints
  //     await this.paymentRepository.clear();
  //     await this.registrationRepository.clear();
  //     await this.feedbackRepository.clear();
  //     await this.eventRepository.clear();
  //     await this.userRepository.clear();
  //     this.logger.log('Database cleared successfully');
  //   } catch (error) {
  //     this.logger.error(
  //       `Error clearing database: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }
}
