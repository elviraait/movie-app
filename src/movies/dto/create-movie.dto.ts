import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Genre } from 'src/generated/prisma/enums';

export class CreateMovieDto {
  @ApiProperty({ description: 'Название фильма', example: 'Inception' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Описание фильма' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Год выпуска', example: 2010 })
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  year: number;

  @ApiProperty({ description: 'Жанр', enum: Genre })
  @IsEnum(Genre)
  genre: Genre;

  @ApiPropertyOptional({ description: 'URL постера' })
  @IsOptional()
  @IsString()
  posterUrl?: string;
}
