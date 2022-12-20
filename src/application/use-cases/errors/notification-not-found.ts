import { NotFoundException } from "@nestjs/common";

class NotificationNotFound extends NotFoundException {
  constructor() {
    super('Notification not found.');
  };
}
export default NotificationNotFound;
