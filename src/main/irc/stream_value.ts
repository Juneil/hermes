import { Command } from "./commands";

export class StreamValue {
    constructor(
        public command: Command,
        public data?: any
    ) {}
}
