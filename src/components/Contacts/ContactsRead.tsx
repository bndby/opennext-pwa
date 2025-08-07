'use client';

interface ContactAddress {
    readonly addressLine: string[];
    readonly country: string;
    readonly city: string;
    readonly dependentLocality: string;
    readonly organization: string;
    readonly phone: string;
    readonly postalCode: string;
    readonly recipient: string;
    readonly region: string;
    readonly sortingCode: string;
}

interface Contact {
    address: ContactAddress[];
    email: string[];
    icon: Blob[];
    name: string[];
    tel: string[];
}

// Добавляем интерфейс для Contacts API
interface ContactsManager {
    getProperties(): Promise<string[]>;
    select(props: string[], options: { multiple: boolean }): Promise<Contact[]>;
}

// Расширяем глобальный интерфейс Navigator
declare global {
    interface Navigator {
        contacts?: ContactsManager;
    }
    interface Window {
        /** Конструктор Contacts API, может отсутствовать */
        ContactsManager?: { new (): ContactsManager };
    }
}

import { Button, Table, TableCell, TableRow, TableHead, TableBody } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ContactsRead = () => {
    const [availableProps, setAvailableProps] = useState<string[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchProps = async () => {
            if ('contacts' in navigator && 'ContactsManager' in window) {
                const props = await navigator.contacts?.getProperties();
                setAvailableProps(props || []);
            }
        };
        fetchProps();
    }, []);

    const handleReadContacts = async () => {
        if ('contacts' in navigator && 'ContactsManager' in window) {
            const contacts = await navigator.contacts?.select(availableProps, { multiple: true });
            setContacts(contacts || []);
        }
    };

    return (
        <div>
            <Button onClick={handleReadContacts} variant="contained">
                Выбрать контакты
            </Button>
            {availableProps.length > 0 && (
                <div>
                    <h3>Доступные поля:</h3>
                    <p>{availableProps.join(', ')}</p>
                </div>
            )}
            {contacts.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Иконка</TableCell>
                            <TableCell>Имя, Телефон</TableCell>
                            <TableCell>Email, Адрес</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.tel[0]}>
                                <TableCell>
                                    {contact.icon.length > 0 && (
                                        <Image
                                            src={URL.createObjectURL(contact.icon[0])}
                                            alt="Contact Icon"
                                            width="36"
                                            height="36"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {contact.name.join(', ')}
                                    <br />
                                    {contact.tel.join(', ')}
                                </TableCell>
                                <TableCell>
                                    {contact.email.join(', ')}
                                    <br />
                                    {contact.address.join(', ')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};
