import type { Decoder } from "decoders";
import { string, object } from "decoders";

export type Message = {
  message: string;
};

export const messageDecoder: Decoder<Message> = object({
  message: string,
});
