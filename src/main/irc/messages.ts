import { Command } from "./commands";

export interface StreamValue {
    raw: string;
    command: Command;
    data?: any;
}

export class MessageParser {

    static parse(raw: string): StreamValue {
        const value = { raw };
    }

}