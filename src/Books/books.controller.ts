import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyAdminGuard, VerifyUserGuard } from '~/common/guards/user.guard';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public } from '~/common/decorators/public.decorator';
import { PageOptionsDto } from '~/common/dtos/page-options.dto';
import { SearchOptionsDto } from '~/common/dtos/search-options.dto';

@Controller('books')
@ApiTags('Books Controller')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('add-book')
  @ApiResponse({ status: 201, description: 'Book successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @UseGuards(VerifyAdminGuard)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.addBook(createBookDto);
  }

  @Get('all-Books')
  @UseGuards(VerifyUserGuard)
  @ApiResponse({ status: 200, description: 'List of all books retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No books found.' })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.booksService.findAll(pageOptionsDto);
  }

  @Get('top-rated')
  @Public()
  @ApiResponse({ status: 200, description: 'Top rated books retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No top rated books found.' })
  async getTopRatedBooks() {
    return this.booksService.topratings();
  }

  @Get('search')
  @Public()
  @ApiResponse({ status: 200, description: 'Books matching the search criteria retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No books found matching the search criteria.' })
  async searchBooks(@Query() searchOptionsDto: SearchOptionsDto) {
    return this.booksService.search(searchOptionsDto);
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, description: 'Book details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(VerifyAdminGuard)
  @ApiResponse({ status: 200, description: 'Book successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(VerifyAdminGuard)
  @ApiResponse({ status: 200, description: 'Book successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
