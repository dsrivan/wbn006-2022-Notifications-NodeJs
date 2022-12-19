import { makeNotification } from "@test/factories/notification-factory";
import InMemoryNotificationsRepository from "@test/repositories/in-memory-notifications-repository";
import { randomUUID } from "crypto";
import { CountRecipientNotifications } from "./count-recipient-notification";

describe('Count recipients notifications', () => {
  it('should be able to count recipient notifications', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const countRecipientNotifications = new CountRecipientNotifications(notificationsRepository);

    const id_01 = randomUUID();
    const id_02 = randomUUID();

    await notificationsRepository.create(makeNotification({ recipientId: id_01 }));
    await notificationsRepository.create(makeNotification({ recipientId: id_02 }));
    await notificationsRepository.create(makeNotification({ recipientId: id_02 }));

    let { count } = await countRecipientNotifications.execute({ recipientId: id_02 });
    expect(count).toEqual(2);
  });
})