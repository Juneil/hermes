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

    static format(content: string): string {
        let i = 0;
        const blocks: FormatBlock[] = [];
        const context: FormatBlock = {
            text: '',
            bold: false,
            italic: false,
            underline: false,
            reverse: false,
            foreground: -1,
            background: -1
        }
        while (i < content.length) {
            switch (content.charAt(i)) {
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
                const match = content.substr(i, 6).match(this.colorRegex) || [];
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
                    context.text += content.charAt(i);
            }
            i++;
        }
        blocks.push(this.clone(context));
        return this.convertToHTML(blocks.filter(_ => _.text));
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
