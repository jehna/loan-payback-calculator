export type Errorify<T> = { [K in keyof T]: boolean }
