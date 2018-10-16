import * as Moment from 'moment';

enum Color {
    WHITE   = 0,
    BLACK   = 1,
    BLUE    = 2,
    GREEN   = 3,
    RED     = 4,
    BROWN   = 5,
    PURPLE  = 6,
    ORANGE  = 7,
    YELLOW  = 8,
    LIME    = 9,
    TEAL    = 10,
    CYAN    = 11,
    ROYAL   = 12,
    PINK    = 13,
    GREY    = 14,
    SILVER  = 15
}

enum Format {
    COLOR       = '\x03',
    BOLD        = '\x02',
    ITALIC      = '\x1D',
    UNDERLINE   = '\x1F',
    REVERSE     = '\x16',
    RESET       = '\x0F'
}

interface FormatBlock {
    text: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    reverse: boolean;
    foreground: number;
    background: number;
}

export class Formatter {

    static colorRegex = /\x03(\d{1,2}(,\d{1,2})?)/;

    static format(content: string, target: string, chars: number): string {
        const lines = this.formatToInject(content, chars);
        const context: FormatBlock = {
            text: '',
            bold: false,
            italic: false,
            underline: false,
            reverse: false,
            foreground: -1,
            background: -1
        }
        const res = lines.map(line => {
            const blocks: FormatBlock[] = [];
            let i = 0;
            while (i < line.length) {
                switch (line.charAt(i)) {
                    case Format.BOLD:
                        blocks.push(this.clone(context));
                        context.bold = !context.bold;
                        break;
                    case Format.ITALIC:
                        blocks.push(this.clone(context));
                        context.italic = !context.italic;
                        break;
                    case Format.UNDERLINE:
                        blocks.push(this.clone(context));
                        context.underline = !context.underline;
                        break;
                    case Format.REVERSE:
                        blocks.push(this.clone(context));
                        context.reverse = !context.reverse;
                        break;
                    case Format.COLOR:
                    const match = line.substr(i, 6).match(this.colorRegex) || [];
                        if (match.length > 1) {
                            i += match[1].length;
                            const codes = match[1].split(',').map(_ => parseInt(_));
                            context.foreground = codes[0];
                            context.background = codes[1] >= 0 ? codes[1] : -1;
                        } else {
                            context.foreground = -1;
                            context.background = -1;
                        }
                        break;
                    default:
                        context.text += line.charAt(i);
                }
                i++;
            }
            blocks.push(this.clone(context));
            context.text = '';
            return this.convertToHTML(blocks.filter(_ => _.text));
        });
        return this.addPrefixAndMerge(res, target);
    }

    private static addPrefixAndMerge(lines: string[], target: string): string {
        return lines
            .map((_, i) => `${i === 0 ? this.targetFormat(target) : this.targetFormat('')} ${_}`)
            .join('<br>');
    }

    private static targetFormat(target: string): string {
        const length = 10;
        if (target.length >= length) {
            target = target.slice(0, length);
        } else {
            let spaces = '';
            for (let i = 0; i < (length - target.length); i++) {
                spaces += '&nbsp;';
            }
            target = spaces + target;
        }
        return `${Moment().format('HH:mm:ss')} ${target} |`;
    }

    private static clone(context: FormatBlock): FormatBlock {
        return Object.assign({}, context);
    }

    private static convertToHTML(blocks: FormatBlock[]): string {
        return blocks
            .map(block => {
                let buffer = block.text;
                if (block.bold) { buffer = this.insertBold(buffer); }
                if (block.italic) { buffer = this.insertItalic(buffer); }
                if (block.underline) { buffer = this.insertUnderline(buffer); }
                return this.insertColors(buffer, block.reverse, block.foreground, block.background);
            })
            .join('');
    }

    private static insertBold(data: string): string {
        return `<strong>${data}</strong>`;
    }

    private static insertItalic(data: string): string {
        return `<em>${data}</em>`;
    }

    private static insertUnderline(data: string): string {
        return `<span style="text-decoration: underline">${data}</span>`;
    }

    private static insertColors(data: string, reverse: boolean, fg: Color, bg: Color): string {
        let colors = [];
        if (reverse) {
            const tmp = fg;
            fg = bg;
            bg = tmp;
        }
        if (fg >= 0) {
            colors.push(`fg-${fg}`);
        }
        if (bg >= 0) {
            colors.push(`bg-${bg}`);
        }
        if (colors.length) {
            return `<span class="${colors.join(' ')}">${data}</span>`;
        } else {
            return data;
        }
    }

    private static formatToInject(data: string, chars: number): string[] {
        const lines = [];
        const content = Array.from(data);
        while (content.length > 0) {
            const tmp = content.slice(0, chars);
            if (tmp.length === chars && tmp.indexOf(' ') > -1) {
                lines.push(content.splice(0, tmp.lastIndexOf(' ') + 1).join('').trim());
            } else {
                lines.push(content.splice(0, chars).join(''));
            }
        }
        return lines;
    }

    // private static colorToHTML(color: Color): string {
    //     switch (color) {
    //         case Color.WHITE:
    //             return '#FFF';
    //         case Color.BLACK:
    //             return '#000';
    //         case Color.BLUE:
    //             return '#000';
    //         case Color.GREEN:
    //             return '#000';
    //         case Color.RED:
    //             return '#000';
    //         case Color.BROWN:
    //             return '#000';
    //         case Color.PURPLE:
    //             return '#000';
    //         case Color.ORANGE:
    //             return '#000';
    //         case Color.YELLOW:
    //             return '#000'
    //         case Color.LIME:
    //             return '#000';
    //         case Color.TEAL:
    //             return '#000';
    //         case Color.CYAN:
    //             return '#000';
    //         case Color.ROYAL:
    //             return '#000';
    //         case Color.PINK:
    //             return '#000';
    //         case Color.GREY:
    //             return '#000';
    //         case Color.SILVER:
    //             return '#000';
    //     }
    // }
}
