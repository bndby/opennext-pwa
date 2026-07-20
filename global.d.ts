// global.d.ts
declare module '*.css';
declare module '*.svg' {
    const content: { src: string; height: number; width: number };
    export default content;
}

interface NDEFRecord {
    recordType: string;
    mediaType?: string | null;
    data?: DataView | null;
    encoding?: string | null;
    lang?: string | null;
}

interface NDEFMessage {
    records: NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
    message: NDEFMessage;
    serialNumber: string;
}

interface NDEFReader extends EventTarget {
    scan(options?: { signal?: AbortSignal }): Promise<void>;
    onreading: ((event: NDEFReadingEvent) => void) | null;
    onreadingerror: ((event: Event) => void) | null;
}

interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
    showOpenFilePicker: () => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: () => Promise<FileSystemFileHandle>;
    NDEFReader: new () => NDEFReader;
}

interface FileSystemDirectoryHandle {
    values: () => AsyncIterable<FileSystemEntry>;
}

interface FileSystemEntry {
    kind: 'file' | 'directory';
    name?: string;
    getFile: () => Promise<File>;
}

interface FileSystemFileHandle {
    name: string;
    getFile: () => Promise<File>;
    createSyncAccessHandle: () => Promise<FileSystemSyncAccessHandle>;
}
