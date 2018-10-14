import { StreamValue } from '../../common';

export class MessageParser {

    static parse(raw: string): StreamValue[] {
        return raw
            .split('\r\n')
            .filter(_ => !!_)
            .map(line => {
                const value: StreamValue = { raw: line, params: [] };
                let position = 0;
                position = this.tags(value);
                position = this.prefix(position, value);
                position = this.command(position, value);
                this.parameters(position, value);
                return value;
            });
    }

    private static tags(value: StreamValue): number {
        const sp = value.raw.indexOf(' ');
        if (!(value.raw.charAt(0) === '@' && sp > 1)) {
            return 0;
        }
        value.tags = value.raw
            .slice(0, sp)
            .split(';')
            .map(_ => _.split('='))
            .reduce((a: any, c) => a[c[0]] = c[1] || true, {});

        return this.ignoreTrailingSpace(value.raw, sp + 1);
    }

    private static prefix(position: number, value: StreamValue): number {
        const sp = value.raw.indexOf(' ', position);
        if (!(value.raw.charAt(position) === ':' && sp > 1)) {
            return position;
        }
        value.prefix = value.raw.slice(position + 1, sp);
        return this.ignoreTrailingSpace(value.raw, sp + 1);
    }

    private static command(position: number, value: StreamValue): number {
        const sp = value.raw.indexOf(' ', position);
        value.command = sp < 0 ?
            value.raw.slice(position) :
            value.raw.slice(position, sp);
        return sp < 1 ? value.raw.length : this.ignoreTrailingSpace(value.raw, sp + 1);
    }

    private static parameters(position: number, value: StreamValue): void {
        while (position < value.raw.length) {
            const sp = value.raw.indexOf(' ', position);
            if (value.raw.charAt(position) === ':') {
                value.params.push(value.raw.slice(position + 1))
                break;
            }
            if (sp !== -1) {
                value.params.push(value.raw.slice(position, sp));
                position = this.ignoreTrailingSpace(value.raw, sp + 1);
                continue;
            } else {
                value.params.push(value.raw.slice(position));
                break;
            }
        }
    }

    private static ignoreTrailingSpace(raw: string, position: number): number {
        while (raw.charAt(position) === ' ') {
            position++;
        }
        return position;
    }
}