export interface StreamValue {
    raw: string;
    tags?: {[key: string]: string};
    prefix?: string;
    command?: string;
    params: string[];
}

export enum DefaultTheme {
    BACKGROUND_COLOR        = '#000000',
    TEXT_COLOR              = '#FFFFFF',
    DELIMITER_COLOR         = '#3F6960',
    PANEL_ID_COLOR          = '#BBBB11',
    TIME_DELIMITER_COLOR    = '#7F8026',
    SEPARATOR_COLOR         = '#BBBB11',
}
