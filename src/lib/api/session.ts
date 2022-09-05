import type { User } from "$lib/models";
import { userDecoder } from "$lib/models";
import * as decoders from "decoders";

export type Session = {
  user: User;
  accessToken: string;
};

export const sessionDecoder: decoders.Decoder<Session> = decoders.object({
  user: userDecoder,
  accessToken: decoders.string,
});
