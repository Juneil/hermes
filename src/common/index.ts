export interface StreamValue {
    raw: string;
    tags?: {[key: string]: string};
    prefix?: string;
    command?: string;
    params: string[];
}
