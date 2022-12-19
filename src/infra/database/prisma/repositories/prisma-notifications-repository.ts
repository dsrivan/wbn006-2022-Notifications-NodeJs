import { Injectable } from "@nestjs/common";
import { Notification } from "@application/entities/notification";
import NotificationsRepository from "@application/repositories/notifications-repository";
import { PrismaService } from "../prisma.service";
import PrismaNotificationMapper from "../mappers/prisma-notification-mapper";

@Injectable()
class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id: notificationId,
      }
    });

    if (!notification)
      return null;

    return PrismaNotificationMapper.toDomain(notification);
  }

  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        id: recipientId,
      },
    });

    // forma 1
    return notifications.map(PrismaNotificationMapper.toDomain);

    // forma 2
    // return notifications.map((notification) => {
    //   return PrismaNotificationMapper.toDomain(notification);
    // });
  }

  async countManyByRecipientId(recipientId: string): Promise<number> {
    const count = await this.prismaService.notification.count({
      where: {
        id: recipientId,
      }
    });

    return count;
  }

  async create(notification: Notification): Promise<void> {
    const raw = PrismaNotificationMapper.toPrisma(notification);

    await this.prismaService.notification.create({ data: raw });
  }

  async save(notification: Notification): Promise<void> {
    const raw = PrismaNotificationMapper.toPrisma(notification);

    await this.prismaService.notification.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });
  }

}
export default PrismaNotificationsRepository;