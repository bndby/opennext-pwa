import { useState, useEffect } from 'react';

const INDEXDB_NAME = 'use-idb';
const INDEXDB_VERSION = 1;
const INDEXDB_STORE_NAME = 'idb';

const dbp = new Promise<IDBDatabase>((resolve, reject) => {
    const openreq = window.indexedDB.open(INDEXDB_NAME, INDEXDB_VERSION);
    openreq.onerror = () => reject(openreq.error);
    openreq.onsuccess = () => resolve(openreq.result);
    openreq.onupgradeneeded = () => openreq.result.createObjectStore(INDEXDB_STORE_NAME);
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export const call = async <T, R = any>(type: string, method: string, ...args: T[]): Promise<IDBRequest<R>> => {
    const db = await dbp;
    const transaction = db.transaction(INDEXDB_STORE_NAME, type as IDBTransactionMode);
    const store = transaction.objectStore(INDEXDB_STORE_NAME);

    return new Promise((resolve, reject) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const req = (store as any)[method](...args) as IDBRequest<R>;
        transaction.oncomplete = () => resolve(req);
        transaction.onabort = transaction.onerror = () => reject(transaction.error);
    });
};

export const get = async <K>(key: K) => (await call('readonly', 'get', key)).result;
export const set = <K, V>(key: K, value: V) =>
    value === undefined ? call('readwrite', 'delete', key) : call<V | K>('readwrite', 'put', value, key);

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useIdb = <K, I>(key: K, initialState: I): [I, (value: I) => Promise<IDBRequest<any>>] => {
    const [item, setItem] = useState<I>(initialState);

    useEffect(() => {
        get(key).then((value) => value === undefined || setItem(value));
    }, [key]);

    return [
        item,
        (value: I) => {
            setItem(value);
            return set(key, value);
        },
    ];
};
