import { IsNotEmpty, IsUUID, Length } from "class-validator";

export class CreateNotificationBody {
  // @IsNotEmpty({ message: 'recipientId não pode ser vazio' })
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;

  @IsNotEmpty()
  @Length(5, 240)
  content: string;

  @IsNotEmpty()
  category: string;
}