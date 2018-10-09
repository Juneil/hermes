import * as Net from 'net';
import * as Split2 from 'split2';
import { Subject } from 'rxjs';
import { filter, tap } from "rxjs/operators";
import { StreamValue, MessageParser } from './messages';
import { Command } from './commands';

export class IRC {

    private stream: Subject<StreamValue> = new Subject();
    private client: Net.Socket | null = null;

    open(host: string, port: number): Subject<StreamValue> {
        this.client = new Net.Socket();
        this.client
            .connect(port, host, () =>
                this.stream.next({ command: Command.CONNECTED, params: [], raw: 'connected' })
            )
            .pipe(Split2())
            .on('data', data => {
                MessageParser
                    .parse(Buffer.from(data).toString('utf8'))
                    .forEach(parsed => this.stream.next(parsed));
            })
            .on('close', () => console.log('Socket closed'));
        this.handle();
        return this.stream;
    }

    private handle() {
        this.stream.pipe(
            filter(_ => _.command === Command.CONNECTED),
            tap(() => this.send('NICK yolo')),
            tap(() => this.send('USER yolo 8 * toto'))
        )
        .subscribe();
        this.stream.pipe(
            filter(_ => _.command === Command.PING),
            tap(_ => this.send(`PONG ${_.params[0]}`))
        )
        .subscribe();
        this.stream.pipe(
            tap(_ => console.log(_.prefix, _.command, _.params))
        )
        .subscribe();
    }

    private send(data: string): void {
        (<Net.Socket>this.client).write(`${data}\r\n`);
    }

}
