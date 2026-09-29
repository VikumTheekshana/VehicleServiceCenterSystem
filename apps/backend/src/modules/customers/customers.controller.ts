import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';

@ApiTags('Customer & Fleet Accounts')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered customers and corporate fleet accounts' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile and vehicle ledger' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new customer profile' })
  create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email?: string;
      isCorporateAccount?: boolean;
      creditLimit?: number;
    },
  ) {
    return this.customersService.create(body);
  }
}
