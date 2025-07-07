import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterActivityDto {
  @ApiProperty({
    description: 'ID del usuario que se va a registrar en la actividad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  userId: string;
}
