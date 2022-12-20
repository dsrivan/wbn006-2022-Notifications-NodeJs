import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SendNotification } from '@application/use-cases/send-notification';
import { CreateNotificationBody } from '../dtos/create-notification-body';
import NotificationViewModel from '@infra/http/view-models/notification-view-model';
import { CancelNotification } from '@application/use-cases/cancel-notification';
import { ReadNotification } from '@application/use-cases/read-notification';
import { UnreadNotification } from '@application/use-cases/unread-notification';
import { CountRecipientNotifications } from '@application/use-cases/count-recipient-notifications';
import { GetRecipientNotifications } from '@application/use-cases/get-recipient-notifications';
import { ApiTags } from '@nestjs/swagger/dist';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger/dist/decorators';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private sendNotification: SendNotification,
    private cancelNotification: CancelNotification,
    private readNotification: ReadNotification,
    private unreadNotification: UnreadNotification,
    private countRecipientNotifications: CountRecipientNotifications,
    private getRecipientNotifications: GetRecipientNotifications,
  ) { }

  @Patch(':notificationId/cancel')
  @ApiOperation({ summary: 'Cancel a notification' })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Cancel a notification by its Id',
    example: 'd67dd352-0361-4f80-afa2-a719b0d4eb58'
  })
  @ApiResponse({ status: 200, description: 'Notification cancelled' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async cancel(@Param('notificationId') notificationId: string) {
    await this.cancelNotification.execute({ notificationId: notificationId });
  }

  @Get('count/from/:recipientId')
  @ApiOperation({ summary: 'Count notifications by a recipient ID' })
  @ApiParam({
    name: 'recipientId',
    type: 'string',
    description: 'Count notifications by a recipient Id',
    example: 'd67dd352-0361-4f80-afa2-a719b0d4eb58'
  })
  @ApiResponse({ status: 200, description: 'Count resolved' })
  async countFromRecipient(@Param('recipientId') recipientId: string) {
    const { count } = await this.countRecipientNotifications.execute({ recipientId });
    return { count };
  }

  @Get('from/:recipientId')
  @ApiOperation({ summary: 'Get notifications by a recipient ID' })
  @ApiParam({
    name: 'recipientId',
    type: 'string',
    description: 'Get notifications by a recipient Id',
    example: 'd67dd352-0361-4f80-afa2-a719b0d4eb58'
  })
  @ApiResponse({ status: 200, description: 'List resolved' })
  async getFromRecipient(@Param('recipientId') recipientId: string) {
    const { notifications } = await this.getRecipientNotifications.execute({ recipientId });
    return {
      notifications: notifications.map(NotificationViewModel.toHTTP)
    };
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Read a notification by its Id' })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Read a notification by its Id',
    example: 'd67dd352-0361-4f80-afa2-a719b0d4eb58'
  })
  @ApiResponse({ status: 200, description: 'Notification readed' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async read(@Param('notificationId') notificationId: string) {
    await this.readNotification.execute({ notificationId: notificationId });
  }

  @Patch(':notificationId/unread')
  @ApiOperation({ summary: 'Unread a notification by its Id' })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Unread a notification by its Id',
    example: 'd67dd352-0361-4f80-afa2-a719b0d4eb58'
  })
  @ApiResponse({ status: 200, description: 'Notification unread' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async unread(@Param('notificationId') notificationId: string) {
    await this.unreadNotification.execute({ notificationId: notificationId });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'New notification created' })
  async create(@Body() body: CreateNotificationBody) {
    const { recipientId, content, category } = body;

    const { notification } = await this.sendNotification.execute({ recipientId, content, category });

    return {
      notification: NotificationViewModel.toHTTP(notification)
    };
  }
}