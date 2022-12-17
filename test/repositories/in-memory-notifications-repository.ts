import { Notification } from "../../src/application/entities/notification";
import NotificationsRepository from "../../src/application/repositories/notifications-repository";

class InMemoryNotificationsRepository implements NotificationsRepository {

  public notifications: Notification[] = [];

  async create(notification: Notification) {
    this.notifications.push(notification);
  }
};

export default InMemoryNotificationsRepository;