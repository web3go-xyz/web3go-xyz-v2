import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PulseChannel } from "./PulseChannel";
import { CoreUser } from "./CoreUser";

@Index("pulse_channel_recipient_pkey", ["id"], { unique: true })
@Entity("pulse_channel_recipient", { schema: "public" })
export class PulseChannelRecipient {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => PulseChannel,
    (pulseChannel) => pulseChannel.pulseChannelRecipients,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "pulse_channel_id", referencedColumnName: "id" }])
  pulseChannel: PulseChannel;

  @ManyToOne(() => CoreUser, (coreUser) => coreUser.pulseChannelRecipients, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: CoreUser;
}
