// global.d.ts
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
    getFile: () => Promise<FileSystemFileHandle>;
}

interface FileSystemFileHandle {
    name: string;
    size: number;
    createSyncAccessHandle: () => Promise<FileSystemSyncAccessHandle>;
}

interface NDEFReadingEvent {
    message: NDEFMessage;
    serialNumber: string;
}
