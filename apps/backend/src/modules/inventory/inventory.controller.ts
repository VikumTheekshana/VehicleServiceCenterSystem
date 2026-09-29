import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';

@ApiTags('Parts & Inventory WMS')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all OEM spare parts and bulk fluid drums' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) {
    return this.inventoryService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single inventory item details' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new part or fluid SKU' })
  create(
    @Body()
    body: {
      partNumber: string;
      name: string;
      category: string;
      isBulkFluid?: boolean;
      currentStock: number;
      unitOfMeasure?: string;
      reorderLevel?: number;
      unitCost: number;
      unitPrice: number;
      binLocation?: string;
    },
  ) {
    return this.inventoryService.create(body);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Adjust physical stock level' })
  updateStock(@Param('id') id: string, @Body() body: { delta: number }) {
    return this.inventoryService.updateStock(id, body.delta);
  }
}
