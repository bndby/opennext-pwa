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
import { useBrowserSupport } from '@/hooks/useClientSide';

export const ContactsRead = () => {
    const [availableProps, setAvailableProps] = useState<string[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isClient, isSupported] = useBrowserSupport('contacts');

    useEffect(() => {
        const fetchProps = async () => {
            if (isSupported) {
                try {
                    const props = await navigator.contacts?.getProperties();
                    setAvailableProps(props || []);
                } catch (error) {
                    console.error('Ошибка при получении свойств контактов:', error);
                }
            }
        };

        if (isSupported) {
            fetchProps();
        }
    }, [isSupported]);

    const handleReadContacts = async () => {
        if (!isSupported) {
            alert('Contacts API не поддерживается в вашем браузере');
            return;
        }

        try {
            const contacts = await navigator.contacts?.select(availableProps, { multiple: true });
            setContacts(contacts || []);
        } catch (error) {
            console.error('Ошибка при чтении контактов:', error);
        }
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Button onClick={handleReadContacts} variant="contained" disabled={!isSupported}>
                Выбрать контакты
            </Button>
            {!isSupported && <p style={{ color: 'red' }}>Contacts API не поддерживается в вашем браузере</p>}
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
