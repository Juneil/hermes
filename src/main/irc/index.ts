import * as Net from 'net';
import { Subject } from 'rxjs';
import { filter, tap } from "rxjs/operators";
import { StreamValue } from './stream_value';
import { Command } from './commands';

export class IRC {

    private stream: Subject<StreamValue> = new Subject();
    private client: Net.Socket | null = null;

    open(host: string, port: number): Subject<StreamValue> {
        this.client = new Net.Socket();
        this.client.connect(port, host, () =>
            this.stream.next(new StreamValue(Command.CONNECTED))
        );
        this.client.on('data', data => {
            const m = Buffer.from(data).toString('utf8');
            console.log(m);
            if (m.includes('PING')) {
                this.send('PONG ' + m.replace('PING ', ''));
            }
        });
        this.client.on('close', () => console.log('Socket closed'));

        this.stream.pipe(
            filter(_ => _.command === Command.CONNECTED),
            tap(() => this.send('NICK yolo')),
            tap(() => this.send('USER yolo 8 * toto'))
        )
        .subscribe();

        return this.stream;
    }

    private send(data: string): void {
        (<Net.Socket>this.client).write(`${data}\r\n`);
    }

}
