import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsNotEmpty, IsUUID, Length } from "class-validator";

export class CreateNotificationBody {
  // @IsNotEmpty({ message: 'recipientId não pode ser vazio' })
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  recipientId: string;

  @IsNotEmpty()
  @Length(5, 240)
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string;
}