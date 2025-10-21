import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { PaymentModule } from './payment/payment.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LocationModule } from './location/location.module';
import { ReservationModule } from './reservation/reservation.module';
import { MaintananceModule } from './maintanance/maintanance.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    CarModule, 
    CustomerModule, 
    RentalModule, 
    PaymentModule, 
    InsuranceModule, 
    LocationModule, 
    ReservationModule, 
    MaintananceModule, UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
