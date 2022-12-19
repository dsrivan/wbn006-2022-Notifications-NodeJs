import { makeNotification } from "@test/factories/notification-factory";
import InMemoryNotificationsRepository from "@test/repositories/in-memory-notifications-repository";
import { randomUUID } from "crypto";
import { GetRecipientNotifications } from "./get-recipient-notification";

describe('Count recipients notifications', () => {
  it('should be able to get recipient notifications', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const getRecipientNotifications = new GetRecipientNotifications(notificationsRepository);

    const id_01 = randomUUID();
    const id_02 = randomUUID();

    await notificationsRepository.create(makeNotification({ recipientId: id_01 }));
    await notificationsRepository.create(makeNotification({ recipientId: id_02 }));
    await notificationsRepository.create(makeNotification({ recipientId: id_02 }));

    let { notifications } = await getRecipientNotifications.execute({ recipientId: id_02 });

    expect(notifications).toHaveLength(2);
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ recipientId: id_02 }),
        expect.objectContaining({ recipientId: id_02 }),
      ]),
    );
  });
})