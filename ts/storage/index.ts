export namespace Storage {
    export function Set(key: string, value: any) {

        localStorage.setItem(key, JSON.stringify(value));
    }
    export function Get<T>(key: string): T {
        const value = localStorage.getItem(key);

        if (value)
            return JSON.parse(value) as T;

        return "" as T
    }
}